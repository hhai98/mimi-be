import { Controller, Get, Post, Body, UseGuards, Query, Param, Patch, Delete } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { CreateVideoDto } from 'src/modules/videos/dto/create-video.dto'
import { UpdateVideoDto } from 'src/modules/videos/dto/update-video.dto'
import { VideosService } from 'src/modules/videos/videos.service'
import { AdminVideoQueryDto } from 'src/modules/videos/dto/video-query.dto'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Videos')
@Controller('admin/videos')
export class AdminVideosController {
  constructor(private readonly videoService: VideosService) {}

  @ApiOperation({ summary: 'Admin - Create a new video' })
  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.createNewVideo(createVideoDto)
  }

  @ApiOperation({ summary: 'Admin - Get list of videos' })
  @Get()
  findAll(@Query() query: AdminVideoQueryDto) {
    return this.videoService.findManyByAdmin(query)
  }

  @ApiOperation({ summary: 'Admin - Get one video by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOneWithDeleted({ id })
  }

  @ApiOperation({ summary: 'Admin - Update video by id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.updateVideo(id, updateVideoDto)
  }

  @ApiOperation({ summary: 'Admin - Delete video by id' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.videoService.deleteVideo(id)
  }
}
