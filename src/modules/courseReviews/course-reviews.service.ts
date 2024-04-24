import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CourseReviewQueryDto } from 'src/modules/courseReviews/dto/course-review-query.dto'
import { CreateCourseReviewDto } from 'src/modules/courseReviews/dto/create-course-review.dto'
import { UpdateCourseReviewDto } from 'src/modules/courseReviews/dto/update-course-review.dto'
import { CourseReview } from 'src/modules/courseReviews/entities/courseReview.entity'
import { CoreService } from 'src/utils/core/core-service'
import { Repository } from 'typeorm'
import { EnrollmentService } from 'src/modules/enrollments/enrollment.service'

@Injectable()
export class CourseReviewsService extends CoreService<CourseReview> {
  constructor(
    @InjectRepository(CourseReview)
    private readonly courseReviewsRepository: Repository<CourseReview>,
    private readonly enrollmentService: EnrollmentService
  ) {
    super(courseReviewsRepository)
  }

  async createByUser(createCourseReviewDto: CreateCourseReviewDto, userId: string) {
    // Only user who has enrolled in the course can review it
    const enrollment = await this.enrollmentService.isUserEnrolledCourse(
      userId,
      createCourseReviewDto.courseId
    )

    if (!enrollment) throw new UnauthorizedException('Hãy mua khóa học trước khi đánh giá.')

    const courseReview = this.courseReviewsRepository.create({
      ...createCourseReviewDto,
      authorId: userId,
    })
    return await this.courseReviewsRepository.save(courseReview)
  }

  async updateByUser(
    id: string,
    updateCourseReviewDto: UpdateCourseReviewDto,
    userId: string
  ): Promise<CourseReview> {
    const courseReview = await this.findOne({ id })

    if (courseReview.authorId !== userId) {
      throw new UnauthorizedException('You are not authorized to update this course review')
    }

    Object.assign(courseReview, updateCourseReviewDto)

    return this.courseReviewsRepository.save(courseReview)
  }

  findAll(query: CourseReviewQueryDto) {
    const { page, limit, rating } = query
    return Promise.all([
      this.courseReviewsRepository.find({
        where: {
          rating,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.getTotalCount(),
    ]).then(([data, count]) => {
      return { data, count }
    })
  }

  async findFromCourse(courseId: string) {
    const courseReviews = await this.courseReviewsRepository.find({
      where: { courseId },
    })
    return courseReviews
  }

  async deleteByUser(id: string, userId: string) {
    const courseReview = await this.courseReviewsRepository.findOne({
      where: { id },
    })

    if (!courseReview) {
      throw new NotFoundException(`Course review with ID ${id} not found`)
    }

    if (courseReview.authorId !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this course review')
    }

    return await this.courseReviewsRepository.remove(courseReview)
  }

  async deleteByAdmin(id: string) {
    const courseReview = await this.courseReviewsRepository.findOne({
      where: { id },
    })

    if (!courseReview) {
      throw new NotFoundException(`Course review with ID ${id} not found`)
    }

    return await this.courseReviewsRepository.remove(courseReview)
  }
}
