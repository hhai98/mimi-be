import { Controller, Get, Post, Body, UseGuards, Query, Param, Patch, Delete } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { ExamsService } from 'src/modules/exams/exams.service'
import { ExamQueryDto } from 'src/modules/exams/dto/exam-query.dto'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { CreateExamDto } from 'src/modules/exams/dto/create-exam.dto'
import { UpdateExamDto } from 'src/modules/exams/dto/update-exam.dto'
import { AttemptQueryDto } from 'src/modules/exams/dto/attempt-query.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Exams')
@Controller('admin/exams')
export class AdminExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @ApiOperation({ summary: 'Admin - Create a new exam' })
  @Post()
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto)
  }

  @ApiOperation({ summary: 'Admin - Get list of exams' })
  @Get()
  findAll(@Query() query: ExamQueryDto) {
    return this.examsService.findManyByAdmin(query)
  }

  @ApiOperation({ summary: 'Admin - Get one exam by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOneExam(id, true)
  }

  @ApiOperation({ summary: 'Admin - Get list attempts and results' })
  @Get(':examId/attempts')
  getListAttemptByAdmin(@Param('examId') examId: string, @Query() query: AttemptQueryDto) {
    return this.examsService.getListAttemptByAdmin(examId, query)
  }

  @ApiOperation({ summary: 'Admin - Update exam by id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(id, updateExamDto)
  }

  @ApiOperation({ summary: 'Admin - Delete exam by id' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.examsService.removeExam(id)
  }
}
