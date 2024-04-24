import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QuestionQueryDto } from 'src/modules/questions/dto/question-query.dto'
import { CreateChoiceQuestionDto } from 'src/modules/questions/dto/create-choice-question.dto'
import { Question } from 'src/modules/questions/entities/question.entity'
import { CoreService } from 'src/utils/core/core-service'
import { ILike, In, Repository } from 'typeorm'
import { ChoiceQuestion } from 'src/modules/questions/entities/choice-questions.entity'
import { ShortAnswerQuestion } from 'src/modules/questions/entities/short-answer-question.entity'
import { TYPES_ENUM } from 'src/modules/questions/enums/types.enum'
import { TrueFalseQuestion } from 'src/modules/questions/entities/true-false-questions.entity'
import { CreateShortAnswerQuestionDto } from 'src/modules/questions/dto/create-short-answer-question.dto copy'
import { CreateTrueFalseQuestionDto } from 'src/modules/questions/dto/create-true-false-question.dto'
import { UpdateChoiceQuestionDto } from 'src/modules/questions/dto/udpate-choice-question.dto'
import { UpdateShortAnswerQuestionDto } from 'src/modules/questions/dto/update-short-answer-question.dto'
import { UpdateTrueFalseQuestionDto } from 'src/modules/questions/dto/update-true-false-question.dto'

@Injectable()
export class QuestionsService extends CoreService<Question> {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    @InjectRepository(ChoiceQuestion)
    private readonly choiceQuestionsRepository: Repository<ChoiceQuestion>,
    @InjectRepository(TrueFalseQuestion)
    private readonly trueFalseQuestionsRepository: Repository<TrueFalseQuestion>,
    @InjectRepository(ShortAnswerQuestion)
    private readonly shortAnswerQuestionsRepository: Repository<ShortAnswerQuestion>
  ) {
    super(questionsRepository)
  }

  async createChoiceQuestion(createChoiceQuestionDto: CreateChoiceQuestionDto) {
    const { question, answerExplain, answers, correctAnswers } = createChoiceQuestionDto
    const questionMetadata = this.questionsRepository.create()
    const choiceQuestion = this.choiceQuestionsRepository.create({
      answers,
      correctAnswers,
      chooseOne: correctAnswers.length == 1,
    })

    questionMetadata.question = question
    questionMetadata.type = TYPES_ENUM.CHOICE_QUESTION
    questionMetadata.answerExplain = answerExplain

    await this.choiceQuestionsRepository.save(choiceQuestion)
    questionMetadata.choiceQuestion = choiceQuestion

    return this.normalizeQuestion(await this.questionsRepository.save(questionMetadata), true)
  }

  async createTrueFalseQuestion(createTrueFalseQuestionDto: CreateTrueFalseQuestionDto) {
    const { question, correctAnswer, answerExplain } = createTrueFalseQuestionDto
    const questionMetadata = this.questionsRepository.create()
    const trueFalseQuestion = this.trueFalseQuestionsRepository.create({
      correctAnswer,
    })

    questionMetadata.question = question
    questionMetadata.type = TYPES_ENUM.TRUE_FALSE_QUESTION
    questionMetadata.answerExplain = answerExplain

    await this.trueFalseQuestionsRepository.save(trueFalseQuestion)
    questionMetadata.trueFalseQuestion = trueFalseQuestion

    return this.normalizeQuestion(await this.questionsRepository.save(questionMetadata), true)
  }

  async createShortAnswerQuestion(createShortAnswerQuestion: CreateShortAnswerQuestionDto) {
    const { question, correctAnswers, answerExplain } = createShortAnswerQuestion
    const questionMetadata = this.questionsRepository.create()
    const shortAnswerQuestion = this.shortAnswerQuestionsRepository.create({
      correctAnswers,
    })

    questionMetadata.question = question
    questionMetadata.type = TYPES_ENUM.SHORT_ANSWER_QUESTION
    questionMetadata.answerExplain = answerExplain

    await this.shortAnswerQuestionsRepository.save(shortAnswerQuestion)
    questionMetadata.shortAnswerQuestion = shortAnswerQuestion

    return this.normalizeQuestion(await this.questionsRepository.save(questionMetadata), true)
  }

  async updateChoiceQuestion(id: string, updateChoiceQuestionDto: UpdateChoiceQuestionDto) {
    const updateQuestion = await this.questionsRepository.findOne({
      where: { id },
      relations: { choiceQuestion: true },
    })

    const { question, answers, correctAnswers, answerExplain } = updateChoiceQuestionDto

    if (!updateQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`)
    }

    if (updateQuestion.type !== TYPES_ENUM.CHOICE_QUESTION)
      throw new BadRequestException(`Question with ID ${id} is not choice question`)

    await this.questionsRepository.update(id, { question, answerExplain })

    await this.choiceQuestionsRepository.update(updateQuestion.choiceQuestion.id, {
      answers,
      correctAnswers,
    })

    if (correctAnswers) {
      await this.choiceQuestionsRepository.update(updateQuestion.choiceQuestion.id, {
        chooseOne: correctAnswers.length == 1,
      })
    }

    return updateQuestion
  }

  async updateTrueFalseQuestion(
    id: string,
    updateTrueFalseQuestionDto: UpdateTrueFalseQuestionDto
  ) {
    const updateQuestion = await this.questionsRepository.findOne({
      where: { id },
      relations: { trueFalseQuestion: true },
    })
    const { question, correctAnswer, answerExplain } = updateTrueFalseQuestionDto

    if (!updateQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`)
    }
    if (updateQuestion.type !== TYPES_ENUM.TRUE_FALSE_QUESTION)
      throw new BadRequestException(`Question with ID ${id} is not true false question`)

    await this.questionsRepository.update(id, { question, answerExplain })
    await this.trueFalseQuestionsRepository.update(updateQuestion.trueFalseQuestion.id, {
      correctAnswer,
    })

    return updateQuestion
  }

  async updateShortAnswerQuestion(
    id: string,
    updateShortAnswerQuestionDto: UpdateShortAnswerQuestionDto
  ) {
    const updateQuestion = await this.questionsRepository.findOne({
      where: { id },
      relations: { shortAnswerQuestion: true },
    })
    const { question, correctAnswers, answerExplain } = updateShortAnswerQuestionDto

    if (!updateQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`)
    }
    if (updateQuestion.type !== TYPES_ENUM.SHORT_ANSWER_QUESTION)
      throw new BadRequestException(`Question with ID ${id} is not short answer question`)

    await this.questionsRepository.update(id, { question, answerExplain })
    await this.shortAnswerQuestionsRepository.update(updateQuestion.shortAnswerQuestion.id, {
      correctAnswers,
    })

    return updateQuestion
  }

  async findAll(query: QuestionQueryDto) {
    const { page, limit, search, type } = query

    const [questions, count] = await this.questionsRepository.findAndCount({
      where: { question: ILike(`%${search}%`), type },
      skip: (page - 1) * limit,
      take: limit,
    })

    const data = this.normalizeQuestions(questions, true)

    return { data, count }
  }

  async findQuestionsFromIds(idList: string[], showAnswer: boolean) {
    const questions = await this.questionsRepository.find({ where: { id: In(idList) } })
    return this.normalizeQuestions(questions, showAnswer)
  }

  normalizeQuestions(questions: Question[], showAnswer: boolean) {
    const data = questions.map((question) => {
      return this.normalizeQuestion(question, showAnswer)
    })

    return data
  }

  normalizeQuestion(question: Question, showAnswer: boolean) {
    const newQuestion = { ...question[question.type], ...question, id: question.id }
    delete newQuestion.trueFalseQuestion
    delete newQuestion.choiceQuestion
    delete newQuestion.shortAnswerQuestion

    if (!showAnswer) {
      delete newQuestion['correctAnswer']
      delete newQuestion['correctAnswers']
      delete newQuestion['answerExplain']
    }
    return newQuestion
  }

  async deleteByAdmin(id: string) {
    const question = await this.questionsRepository.findOne({
      where: { id },
    })

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`)
    }

    return await this.questionsRepository.remove(question)
  }
}
