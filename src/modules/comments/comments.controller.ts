import { Controller, Get, Post, Delete, Param, Body, UseGuards, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { CommentsService } from 'src/modules/comments/comments.service'
import { CreateCommentDto } from 'src/modules/comments/dto/create-comment.dto'
import { UpdateCommentDto } from 'src/modules/comments/dto/update-comment.dto'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { User } from 'src/modules/users/entities/user.entity'

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Get a comment by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id)
  }

  @ApiOperation({ summary: 'Get all comments from video' })
  @Get('/video/:id')
  findAll(@Param('id') id: string) {
    return this.commentsService.findFromVideo(id)
  }

  @ApiBearerAuth()
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Create a new comment' })
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: User) {
    return this.commentsService.createByUser(createCommentDto, user.id)
  }

  @ApiBearerAuth()
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Update a comment by ID' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User
  ) {
    return this.commentsService.updateByUser(id, updateCommentDto, user.id)
  }

  @ApiBearerAuth()
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.deleteByUser(id, user.id)
  }
}
