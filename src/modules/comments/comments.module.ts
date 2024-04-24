import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminCommentController } from 'src/modules/comments/admin.comments.controller'
import { CommentController } from 'src/modules/comments/comments.controller'
import { CommentsService } from 'src/modules/comments/comments.service'
import { Comment } from 'src/modules/comments/entities/comment.entity'
import { Video } from 'src/modules/videos/entities/video.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Comment, Video])],
  controllers: [CommentController, AdminCommentController],
  providers: [CommentsService],
})
export class CommentsModule {}
