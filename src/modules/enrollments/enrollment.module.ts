import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Enrollment } from 'src/modules/enrollments/entities/enrollment.entity'
import { EnrollmentService } from 'src/modules/enrollments/enrollment.service'
import { FinishedVideosModule } from 'src/modules/finishedVideos/finishedVideos.module'

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment]), FinishedVideosModule],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
