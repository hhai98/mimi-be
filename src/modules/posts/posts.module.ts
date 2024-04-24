import { Module } from '@nestjs/common'
import { PostsService } from 'modules/posts/posts.service'
import { PostsController } from 'modules/posts/posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from 'modules/posts/entities/post.entity'
import { AdminPostsController } from 'modules/posts/admin.posts.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController, AdminPostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
