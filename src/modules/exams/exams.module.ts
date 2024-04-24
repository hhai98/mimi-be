import { Module } from '@nestjs/common'
import { ExamsService } from 'modules/exams/exams.service'
import { ExamsController } from 'modules/exams/exams.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Exam } from 'modules/exams/entities/exam.entity'
import { AdminExamsController } from 'modules/exams/admin.exams.controller'
import { Attempt } from 'src/modules/exams/entities/attempt.entity'
import { FinishedVideosModule } from 'src/modules/finishedVideos/finishedVideos.module'
import { QuestionsModule } from 'src/modules/questions/questions.module'
import { Video } from 'src/modules/videos/entities/video.entity'
import { AnonymousExamsController } from 'src/modules/exams/anonymous.exams.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Exam, Attempt, Video]),
    FinishedVideosModule,
    QuestionsModule,
  ],
  controllers: [ExamsController, AdminExamsController, AnonymousExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
