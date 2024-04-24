import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PostQueryDto } from 'src/modules/posts/dto/post-query.dto'
import { PostsService } from 'src/modules/posts/posts.service'

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'User - Get all posts' })
  @Get()
  findAll(@Query() query: PostQueryDto) {
    return this.postsService.findManyByUser(query)
  }

  @ApiOperation({ summary: 'User - Get all suggestion posts' })
  @Get('/suggestion')
  findAllSuggestion() {
    return this.postsService.findSuggestionPosts()
  }

  @ApiOperation({ summary: 'User - Get all featured posts' })
  @Get('/featured')
  getFeaturedPosts() {
    return this.postsService.findFeaturedPosts()
  }

  @ApiOperation({ summary: 'User - Get one post by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne({ id })
  }
}
