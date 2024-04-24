import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CourseReview } from 'modules/courseReviews/entities/courseReview.entity'
import { AdminCourseReviewController } from 'src/modules/courseReviews/admin.course-reviews.controller'
import { CourseReviewController } from 'src/modules/courseReviews/course-reviews.controller'
import { CourseReviewsService } from 'src/modules/courseReviews/course-reviews.service'
import { EnrollmentModule } from 'src/modules/enrollments/enrollment.module'

@Module({
  imports: [TypeOrmModule.forFeature([CourseReview]), EnrollmentModule],
  controllers: [CourseReviewController, AdminCourseReviewController],
  providers: [CourseReviewsService],
})
export class CourseReviewsModule {}
