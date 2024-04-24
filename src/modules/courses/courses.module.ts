import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/modules/auth/auth.module'
import { AdminCoursesController } from 'src/modules/courses/admin.courses.controller'
import { CoursesController } from 'src/modules/courses/courses.controller'
import { CoursesService } from 'src/modules/courses/courses.service'
import { Course } from 'src/modules/courses/entities/course.entity'
import { EnrollmentModule } from 'src/modules/enrollments/enrollment.module'
import { FinishedVideosModule } from 'src/modules/finishedVideos/finishedVideos.module'
import { LessonsModule } from 'src/modules/lessons/lessons.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    AuthModule,
    EnrollmentModule,
    LessonsModule,
    FinishedVideosModule,
  ],
  controllers: [CoursesController, AdminCoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
