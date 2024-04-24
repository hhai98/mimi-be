import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminLessonsController } from 'src/modules/lessons/admin.lessons.controller'
import { Lesson } from 'src/modules/lessons/entities/lesson.entity'
import { LessonsService } from 'src/modules/lessons/lessons.service'
import { LessonsController } from 'src/modules/lessons/lessons.controller'
import { AuthModule } from 'src/modules/auth/auth.module'
import { EnrollmentModule } from 'src/modules/enrollments/enrollment.module'
import { FinishedVideosModule } from 'src/modules/finishedVideos/finishedVideos.module'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), AuthModule, EnrollmentModule, FinishedVideosModule],
  providers: [LessonsService],
  controllers: [AdminLessonsController, LessonsController],
  exports: [LessonsService],
})
export class LessonsModule {}
