import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CommentsService } from 'src/modules/comments/comments.service'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Comments')
@Controller('admin/comments')
export class AdminCommentController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Admin - Get a comment by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id)
  }

  @ApiOperation({ summary: 'Admin - Get all comments' })
  @Get()
  findAll() {
    return this.commentsService.findAll()
  }

  @ApiOperation({ summary: 'Admin - Get all comments from video' })
  @Get('/video/:id')
  findFromVideo(@Param('id') id: string) {
    return this.commentsService.findFromVideo(id)
  }

  @ApiOperation({ summary: 'Admin - Delete a comment by ID' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.commentsService.deleteByAdmin(id)
  }
}
