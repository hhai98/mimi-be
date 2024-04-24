import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/modules/auth/auth.module'
import { EnrollmentModule } from 'src/modules/enrollments/enrollment.module'
import { Enrollment } from 'src/modules/enrollments/entities/enrollment.entity'
import { Exam } from 'src/modules/exams/entities/exam.entity'
import { ExamsModule } from 'src/modules/exams/exams.module'
import { FinishedVideosModule } from 'src/modules/finishedVideos/finishedVideos.module'
import { LessonsModule } from 'src/modules/lessons/lessons.module'
import { AdminVideosController } from 'src/modules/videos/admin.videos.controller'
import { Video } from 'src/modules/videos/entities/video.entity'
import { VideosController } from 'src/modules/videos/videos.controller'
import { VideosService } from 'src/modules/videos/videos.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, Enrollment, Exam]),
    EnrollmentModule,
    LessonsModule,
    AuthModule,
    FinishedVideosModule,
    ExamsModule,
  ],
  providers: [VideosService],
  controllers: [AdminVideosController, VideosController],
})
export class VideosModule {}
