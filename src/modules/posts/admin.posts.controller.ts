import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { PostsService } from 'src/modules/posts/posts.service'
import { PostQueryDto } from 'src/modules/posts/dto/post-query.dto'
import { UpdatePostDto } from 'modules/posts/dto/update-post.dto'
import { CreatePostDto } from 'src/modules/posts/dto/create-post.dto'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { User } from 'src/modules/users/entities/user.entity'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Posts')
@Controller('admin/posts')
export class AdminPostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Admin - Create a new post' })
  @Post()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postsService.createPost(createPostDto, user.id)
  }

  @ApiOperation({ summary: 'Admin - Get list of posts' })
  @Get()
  async findAll(@Query() query: PostQueryDto) {
    return await this.postsService.findManyByAdmin(query)
  }

  @ApiOperation({ summary: 'Admin - Get one post by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne({ id })
  }

  @ApiOperation({ summary: 'Admin - Update post' })
  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto)
  }

  @ApiOperation({ summary: 'Admin - Delete a post' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postsService.removePost(id)
  }
}
