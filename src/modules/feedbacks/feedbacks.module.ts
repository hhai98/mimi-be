import { Module } from '@nestjs/common'
import { FeedbacksService } from 'modules/feedbacks/feedbacks.service'
import { FeedbacksController } from 'modules/feedbacks/feedbacks.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Feedback } from 'modules/feedbacks/entities/feedback.entity'
import { AdminFeedbacksController } from 'modules/feedbacks/admin.feedbacks.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  controllers: [FeedbacksController, AdminFeedbacksController],
  providers: [FeedbacksService],
  exports: [FeedbacksService],
})
export class FeedbacksModule {}
