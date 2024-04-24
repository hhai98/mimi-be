import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AddUserDto } from 'src/modules/courses/dto/add-user-to-course.dto'
import { AdminCourseQueryDto, UserCourseQueryDto } from 'src/modules/courses/dto/course-query.dto'
import { Course } from 'src/modules/courses/entities/course.entity'
import { ILessonWithMoreInfo, IVideoWithMoreInfo } from 'src/modules/courses/interfaces'
import { EnrollmentService } from 'src/modules/enrollments/enrollment.service'
import { FinishedVideosService } from 'src/modules/finishedVideos/finishedVideos.service'
import { LessonsService } from 'src/modules/lessons/lessons.service'
import { CoreService } from 'src/utils/core/core-service'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { ILike, In, Repository } from 'typeorm'

@Injectable()
export class CoursesService extends CoreService<Course> {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly enrollmentService: EnrollmentService,
    private readonly lessonsService: LessonsService,
    private readonly finishedVideoService: FinishedVideosService
  ) {
    super(courseRepository)
  }

  getFeaturedCourses(): Promise<Course[]> {
    return this.courseRepository.find({
      where: { isFeatured: true, isPublished: true },
      relations: ['teacher'],
    })
  }

  getEnrolledCourses(userId: string) {
    return this.enrollmentService.getEnrolledCourses(userId)
  }

  async findManyByUser(query: UserCourseQueryDto) {
    const { search } = { ...query }
    const [data, count] = await this.repo.findAndCount({
      where: {
        title: ILike(`%${search}%`),
        isPublished: true,
      },
      relations: {
        lessons: true,
        teacher: {
          user: true,
        },
      },
      loadEagerRelations: false,
    })
    return infinityPagination({ data, count }, query)
  }

  async findManyByAdmin(query: AdminCourseQueryDto) {
    const { limit, page, search, isPublished } = { ...query }
    const [data, count] = await this.repo.findAndCount({
      where: {
        title: ILike(`%${search}%`),
        isPublished,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        lessons: true,
        teacher: {
          user: true,
        },
      },
      loadEagerRelations: false,
    })

    // Enrich data with the number of enrollments for each course
    const enrichedData = await Promise.all(
      data.map(async (course) => {
        const totalEnrollment = await this.enrollmentService.getTotalEnrollmentInOneCourse(
          course.id
        )
        return { ...course, totalEnrollment }
      })
    )

    return infinityPagination({ data: enrichedData, count }, query)
  }

  async getCourseDetailsByUser(id: string, userId: string) {
    const course = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .leftJoinAndSelect('course.lessons', 'lessons')
      .leftJoinAndSelect('lessons.videos', 'videos')
      .where('course.id = :id', { id })
      .andWhere('course.isPublished = :isPublished', { isPublished: true })
      .orderBy('lessons.createdAt', 'ASC')
      .addOrderBy('videos.createdAt', 'ASC')
      .getOne()

    if (!course) {
      throw new NotFoundException(`Khóa học với ID ${id} không tồn tại`)
    }

    const isEnroll = await this.enrollmentService.isUserEnrolledCourse(userId, id)

    if (!isEnroll) {
      course.lessons.forEach((lesson) => {
        this.lessonsService.trimLesson(lesson)
      })
    }

    let lessons = course.lessons as ILessonWithMoreInfo[]

    if (isEnroll) {
      lessons = (await Promise.all(
        lessons.map(async (lesson) => {
          let videos = lesson.videos
          videos = (await this.finishedVideoService.checkVideoArrayFinish(
            lesson.videos,
            userId
          )) as IVideoWithMoreInfo[]
          return { ...lesson, videos } as ILessonWithMoreInfo
        })
      )) as ILessonWithMoreInfo[]
    }

    return { ...course, lessons }
  }

  async getCourseDetailsByAdmin(id: string) {
    const course = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .leftJoinAndSelect('course.lessons', 'lessons')
      .leftJoinAndSelect('lessons.videos', 'videos')
      .orderBy('lessons.createdAt', 'ASC')
      .addOrderBy('videos.createdAt', 'ASC')
      .where('course.id = :id', { id })
      .getOne()

    if (!course) {
      throw new NotFoundException(`Khóa học với ID ${id} không tồn tại`)
    }

    return course
  }

  async findCoursesFromIds(idList: string[]) {
    const courses = await this.courseRepository.find({
      where: { id: In(idList) },
      relations: ['teacher'],
      loadEagerRelations: false,
    })
    return courses
  }

  async validateCoursesFromIds(idList: string[]) {
    for (let i = 0; i < idList.length; i++) {
      const course = await this.courseRepository.findOneBy({ id: idList[i] })
      if (!course) throw new NotFoundException(`Course index ${i} with id ${idList[i]} not found`)
    }
    return
  }

  async deleteCourse(id: string) {
    const course = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.lessons', 'lessons')
      .leftJoinAndSelect('lessons.videos', 'videos')
      .where('course.id = :id', { id })
      .getOne()

    if (!course) throw new NotFoundException(`Khóa học với ID ${id} không tìm thấy.`)

    return this.courseRepository.remove(course)
  }

  async addUsersToCourse(id: string, listUser: AddUserDto) {
    const course = await this.courseRepository.findOne({ where: { id } })
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`)
    }

    const { userId } = listUser
    const enrollPromises = userId.map((userIdItem) =>
      this.enrollmentService.addEnrolledCourse(userIdItem, id)
    )

    await Promise.all(enrollPromises)
  }

  getAllEnrolledCoursesOfUser(userId: string) {
    return this.enrollmentService.getEnrolledCourses(userId)
  }
}
