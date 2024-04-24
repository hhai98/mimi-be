import { Controller, Get, Param, Delete, UseGuards, Query, Post, Body, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { QuestionsService } from 'src/modules/questions/questions.service'
import { QuestionQueryDto } from 'src/modules/questions/dto/question-query.dto'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { CreateChoiceQuestionDto } from 'src/modules/questions/dto/create-choice-question.dto'
import { CreateTrueFalseQuestionDto } from 'src/modules/questions/dto/create-true-false-question.dto'
import { CreateShortAnswerQuestionDto } from 'src/modules/questions/dto/create-short-answer-question.dto copy'
import { UpdateChoiceQuestionDto } from 'src/modules/questions/dto/udpate-choice-question.dto'
import { UpdateShortAnswerQuestionDto } from 'src/modules/questions/dto/update-short-answer-question.dto'
import { UpdateTrueFalseQuestionDto } from 'src/modules/questions/dto/update-true-false-question.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Questions')
@Controller('admin/questions')
export class AdminQuestionController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiOperation({ summary: 'Admin - Get a question by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.questionsService.normalizeQuestion(
      await this.questionsService.findOne({ id }),
      true
    )
  }

  @ApiOperation({ summary: 'Admin - Get list of questions' })
  @Get()
  async findAll(@Query() query: QuestionQueryDto) {
    return infinityPagination(await this.questionsService.findAll(query), query)
  }

  @ApiOperation({ summary: 'Admin - Create a choice question' })
  @Post('choice-question')
  createChoiceQuestion(@Body() createChoiceQuestionDto: CreateChoiceQuestionDto) {
    return this.questionsService.createChoiceQuestion(createChoiceQuestionDto)
  }

  @ApiOperation({ summary: 'Admin - Create a true false question' })
  @Post('true-false-question')
  createTrueFalseQuestion(@Body() createTrueFalseQuestionDto: CreateTrueFalseQuestionDto) {
    return this.questionsService.createTrueFalseQuestion(createTrueFalseQuestionDto)
  }

  @ApiOperation({ summary: 'Admin - Create a short answer question' })
  @Post('short-answer-question')
  createMatchingQuestion(@Body() createShortAnswerQuestionDto: CreateShortAnswerQuestionDto) {
    return this.questionsService.createShortAnswerQuestion(createShortAnswerQuestionDto)
  }

  @ApiOperation({ summary: 'Admin - Update a choice question' })
  @Patch('choice-question/:id') // Add a Patch route for updating choice questions
  updateChoiceQuestion(
    @Param('id') id: string,
    @Body() updateChoiceQuestionDto: UpdateChoiceQuestionDto
  ) {
    return this.questionsService.updateChoiceQuestion(id, updateChoiceQuestionDto)
  }

  @ApiOperation({ summary: 'Admin - Update a true-false question' })
  @Patch('true-false-question/:id')
  updateTrueFalseQuestion(
    @Param('id') id: string,
    @Body() updateTrueFalseQuestionDto: UpdateTrueFalseQuestionDto
  ) {
    return this.questionsService.updateTrueFalseQuestion(id, updateTrueFalseQuestionDto)
  }

  @ApiOperation({ summary: 'Admin - Update a short answer question' })
  @Patch('short-answer-question/:id')
  updateShortAnswerQuestion(
    @Param('id') id: string,
    @Body() updateShortAnswerQuestionDto: UpdateShortAnswerQuestionDto
  ) {
    return this.questionsService.updateShortAnswerQuestion(id, updateShortAnswerQuestionDto)
  }

  @ApiOperation({ summary: 'Admin - Delete a question by ID' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.questionsService.deleteByAdmin(id)
  }
}
