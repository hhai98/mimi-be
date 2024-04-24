import { FinishedVideosService } from 'src/modules/finishedVideos/finishedVideos.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EnrollmentQueryDto } from 'src/modules/enrollments/dto/enrollment-query.dto'
import { Enrollment } from 'src/modules/enrollments/entities/enrollment.entity'
import { CoreService } from 'src/utils/core/core-service'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { Repository } from 'typeorm'

@Injectable()
export class EnrollmentService extends CoreService<Enrollment> {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepository: Repository<Enrollment>,
    private readonly finishedVideosService: FinishedVideosService
  ) {
    super(enrollmentsRepository)
  }

  async addEnrolledCourse(userId: string, courseId: string) {
    const isEnroll = await this.isUserEnrolledCourse(userId, courseId)
    if (isEnroll) return

    const enrollment = this.enrollmentsRepository.create({
      userId,
      courseId,
    })

    await this.enrollmentsRepository.save(enrollment)
  }

  async isUserEnrolledCourse(userId: string, courseId: string) {
    if (!userId) return false
    const enroll = await this.enrollmentsRepository.findOneBy({ userId, courseId })
    return enroll !== null
  }

  async getTotalEnrollmentInOneCourse(courseId: string) {
    try {
      if (!courseId) throw new Error()

      const count = await this.enrollmentsRepository.count({
        where: { courseId },
      })

      return count
    } catch (error) {
      throw new BadRequestException('Invalid course ID')
    }
  }

  async getEnrolledCourses(userId: string) {
    const enrollments = await this.enrollmentsRepository.find({
      where: {
        userId,
      },
      relations: {
        course: true,
      },
      loadEagerRelations: false,
    })
    return enrollments.map((enroll) => enroll.course)
  }

  async deleteEnrolledCourse(id: string) {
    await this.enrollmentsRepository.delete({ id })
  }

  async getListStudyProgress(query: EnrollmentQueryDto) {
    const { page, limit } = { ...query }
    const [data, count] = await this.enrollmentsRepository.findAndCount({
      relations: {
        user: true,
        course: {
          lessons: {
            videos: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      loadEagerRelations: false,
    })

    // Calculate progress for each enrollment
    const enrichedData = await Promise.all(
      data.map(async (enrollment) => {
        const totalVideos = enrollment.course.lessons.reduce(
          (total, lesson) => total + lesson.videos.length,
          0
        )
        const finishedVideosCount =
          await this.finishedVideosService.getFinishedVideosCountInOneCourse(
            enrollment.user.id,
            enrollment.courseId
          )

        const progress = totalVideos > 0 ? (finishedVideosCount / totalVideos) * 100 : 0

        // clear data
        enrollment.course.lessons = null
        enrollment.course.benefits = null
        enrollment.course.summary = null

        // Add progress field to the enrollment object
        return {
          ...enrollment,
          progress,
          totalVideos,
          finishedVideosCount,
        }
      })
    )

    return infinityPagination({ data: enrichedData, count }, query)
  }
}
