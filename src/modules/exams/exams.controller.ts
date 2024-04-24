import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { ExamsService } from 'src/modules/exams/exams.service'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { ExamQueryDto } from 'src/modules/exams/dto/exam-query.dto'
import { SubmitAttemptDto } from 'src/modules/exams/dto/submit-attempt.dto'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { User } from 'src/modules/users/entities/user.entity'

@ApiBearerAuth()
@Roles(ROLE_ENUM.USER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @ApiOperation({ summary: 'User - Get list of exams' })
  @Get()
  @Get()
  async findAll(@Query() query: ExamQueryDto) {
    const { limit, page } = query

    return infinityPagination(
      await this.examsService.findManyWithPagination({ limit, page }),
      query
    )
  }

  @ApiOperation({ summary: 'User - Get one exam by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOneExam(id, false)
  }

  @ApiOperation({ summary: 'User - Create new attempt to do exam' })
  @Post(':videoId')
  create(@Param('videoId') videoId: string, @CurrentUser() user: User) {
    const userId = user.id
    return this.examsService.createNewAttempt(videoId, userId)
  }

  @ApiOperation({ summary: 'User - Get list attempts' })
  @Get(':videoId/attempts')
  getListAttemptByUser(@Param('videoId') videoId: string, @CurrentUser() user: User) {
    const userId = user.id
    return this.examsService.getListAttemptByUser(videoId, userId)
  }

  @ApiOperation({ summary: 'User - Submit answer to exam' })
  @Post('submit/:examId')
  submit(
    @Param('examId') id: string,
    @Body() submitAttemptDto: SubmitAttemptDto,
    @CurrentUser() user: User
  ) {
    const userId = user.id
    return this.examsService.submitAttempt(submitAttemptDto, id, userId)
  }
}
