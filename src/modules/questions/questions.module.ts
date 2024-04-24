import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Question } from 'modules/questions/entities/question.entity' // Update this import
import { AdminQuestionController } from 'src/modules/questions/admin.questions.controller'
import { QuestionsService } from 'src/modules/questions/questions.service'
import { ChoiceQuestion } from 'src/modules/questions/entities/choice-questions.entity'
import { ShortAnswerQuestion } from 'src/modules/questions/entities/short-answer-question.entity'
import { TrueFalseQuestion } from 'src/modules/questions/entities/true-false-questions.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, ChoiceQuestion, ShortAnswerQuestion, TrueFalseQuestion]),
  ], // Update the entity
  controllers: [AdminQuestionController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {} // Rename the class
