import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOneOptions, ILike, Repository } from 'typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { Lesson } from 'src/modules/lessons/entities/lesson.entity'
import { EnrollmentService } from 'src/modules/enrollments/enrollment.service'
import { FinishedVideosService } from 'src/modules/finishedVideos/finishedVideos.service'
import { AdminLessonQueryDto } from 'src/modules/lessons/dto/lesson-query.dto'
import { infinityPagination } from 'src/utils/infinity-pagination'

@Injectable()
export class LessonsService extends CoreService<Lesson> {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly enrollmentsService: EnrollmentService,
    private readonly finishedVideoService: FinishedVideosService
  ) {
    super(lessonRepository)
  }

  async findManyByAdmin(query: AdminLessonQueryDto) {
    const { limit, page, search, isPublished } = { ...query }
    const [data, count] = await this.repo.findAndCount({
      where: {
        title: ILike(`%${search}%`),
        isPublished,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        videos: true,
      },
    })
    return infinityPagination({ data, count }, query)
  }

  async getLessonDetailsByUser(id: string, userId: string) {
    const options: FindOneOptions = {
      where: { id },
      relations: ['videos'],
      order: {
        videos: { createdAt: 'ASC' },
      },
    }

    const lesson = await this.lessonRepository.findOne(options)

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`)
    }

    const isEnroll = await this.enrollmentsService.isUserEnrolledCourse(userId, lesson.courseId)
    if (!isEnroll) this.trimLesson(lesson)

    let videos
    if (userId)
      videos = await this.finishedVideoService.checkVideoArrayFinish(lesson.videos, userId)
    else videos = lesson.videos
    return { ...lesson, videos }
  }

  async getLessonDetailsByAdmin(id: string) {
    const options: FindOneOptions = {
      where: { id },
      relations: ['videos'],
      order: {
        videos: { createdAt: 'ASC' },
      },
    }

    const lesson = await this.lessonRepository.findOne(options)

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`)
    }

    return lesson
  }

  trimLesson(lesson: Lesson) {
    lesson.videos = lesson.videos.map((video) => {
      if (!video.isFree) video.link = null
      return video
    })
    return lesson
  }

  async deleteLesson(id: string) {
    const lesson = await this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.videos', 'videos')
      .where('lesson.id = :id', { id })
      .getOne()

    if (!lesson) throw new NotFoundException(`Lesson with id ${id} not exist`)

    return this.lessonRepository.remove(lesson)
  }

  async updateLessonDuration(lessonId: string) {
    const lesson = await this.lessonRepository.findOne({
      where: {
        id: lessonId,
      },
      relations: {
        videos: true,
      },
    })

    if (lesson) {
      lesson.duration = lesson.videos.reduce(
        (totalDuration, video) => totalDuration + video.duration,
        0
      )
      await this.lessonRepository.save(lesson)
    }
  }
}
