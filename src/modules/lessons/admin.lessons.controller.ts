import { Controller, Get, Post, Body, UseGuards, Query, Param, Patch, Delete } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { CreateLessonDto } from 'src/modules/lessons/dto/create-lesson.dto'
import { AdminLessonQueryDto } from 'src/modules/lessons/dto/lesson-query.dto'
import { UpdateLessonDto } from 'src/modules/lessons/dto/update-lesson.dto'
import { LessonsService } from 'src/modules/lessons/lessons.service'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Lessons')
@Controller('admin/lessons')
export class AdminLessonsController {
  constructor(private readonly lessonService: LessonsService) {}

  @ApiOperation({ summary: 'Admin - Create a new lesson' })
  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.create(createLessonDto)
  }

  @ApiOperation({ summary: 'Admin - Get list of lessons' })
  @Get()
  findAll(@Query() query: AdminLessonQueryDto) {
    return this.lessonService.findManyByAdmin(query)
  }

  @ApiOperation({ summary: 'Admin - Get one lesson by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.getLessonDetailsByAdmin(id)
  }

  @ApiOperation({ summary: 'Admin - Update lesson by id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(id, updateLessonDto)
  }

  @ApiOperation({ summary: 'Admin - Delete lesson by id' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.lessonService.deleteLesson(id)
  }
}
