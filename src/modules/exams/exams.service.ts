import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { ILike, Repository } from 'typeorm'
import { Exam } from 'modules/exams/entities/exam.entity'
import { Attempt } from 'src/modules/exams/entities/attempt.entity'
import { SubmitAttemptDto } from 'src/modules/exams/dto/submit-attempt.dto'
import { QuestionsService } from 'src/modules/questions/questions.service'
import { TYPES_ENUM } from 'src/modules/questions/enums/types.enum'
import { Video } from 'src/modules/videos/entities/video.entity'
import { FinishedVideosService } from 'src/modules/finishedVideos/finishedVideos.service'
import { ExamQueryDto } from 'src/modules/exams/dto/exam-query.dto'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { AttemptQueryDto } from 'src/modules/exams/dto/attempt-query.dto'

@Injectable()
export class ExamsService extends CoreService<Exam> {
  constructor(
    @InjectRepository(Exam) private examsRepository: Repository<Exam>,
    @InjectRepository(Video) private videosRepository: Repository<Video>,
    @InjectRepository(Attempt) private attemptsRepository: Repository<Attempt>,
    private readonly questionsService: QuestionsService,
    private readonly finishedVideoService: FinishedVideosService
  ) {
    super(examsRepository)
  }

  async findManyByAdmin(query: ExamQueryDto) {
    const { limit, page, search } = { ...query }
    const [data, count] = await this.repo.findAndCount({
      where: {
        title: ILike(`%${search}%`),
      },
      skip: (page - 1) * limit,
      take: limit,
    })
    return infinityPagination({ data, count }, query)
  }

  async findOneExam(id: string, showAnswer: boolean) {
    const exam = await this.examsRepository.findOneBy({ id })
    if (!exam) throw new NotFoundException(`Bài kiểm tra với id ${id} không tồn tại`)

    const questions = await this.questionsService.findQuestionsFromIds(exam.questionIds, showAnswer)
    return { ...exam, questions }
  }

  async createNewAttempt(videoId: string, userId: string) {
    const video = await this.videosRepository.findOneBy({ id: videoId })

    if (!video) throw new NotFoundException(`Video with id ${videoId} not found`)
    if (!video.examId) throw new BadRequestException('Video does not have an exam to do')

    const attempt = this.attemptsRepository.create({
      userId,
      videoId,
      examId: video.examId,
    })

    return await this.attemptsRepository.save(attempt)
  }

  async getListAttemptByUser(videoId: string, userId: string) {
    const video = await this.videosRepository.findOneBy({ id: videoId })

    if (!video) throw new NotFoundException(`Video with id ${videoId} not found`)
    if (!video.examId) return { data: [], totalItems: 0 }

    const [attempts, count] = await this.attemptsRepository.findAndCount({
      where: {
        userId,
        videoId,
        examId: video.examId,
      },
    })

    return { data: attempts, totalItems: count }
  }

  async getListAttemptByAdmin(examId: string, query: AttemptQueryDto) {
    const { limit, page } = { ...query }
    const [attempts, count] = await this.attemptsRepository.findAndCount({
      where: {
        examId,
        isFinished: true,
      },
      relations: ['user', 'video', 'exam'],
      skip: (page - 1) * limit,
      take: limit,
    })

    return infinityPagination({ data: attempts, count }, query)
  }

  async submitAttempt(submitAttemptDto: SubmitAttemptDto, examId: string, userId: string) {
    const exam = await this.examsRepository.findOneBy({ id: examId })
    if (!exam) throw new NotFoundException(`Exam with id ${examId} not found`)

    const attempt = await this.attemptsRepository.findOne({
      where: {
        examId,
        userId,
        isFinished: false,
      },
    })

    if (!attempt)
      throw new NotFoundException("User hasn't start an attempt or has already submitted")
    const questions = await this.questionsService.findQuestionsFromIds(exam.questionIds, true)

    // Calculate point
    let totalPoint = 0
    const userAnswers = submitAttemptDto.userAnswers.map((element, index) => {
      const questionId = element.questionId
      const checkQuestion = questions.find((question) => question.id === element.questionId)
      const userAnswer = element.userAnswer

      if (!checkQuestion)
        throw new NotFoundException(`Question index ${index} with id ${questionId} not found`)

      let isCorrect = false

      switch (checkQuestion.type) {
        case TYPES_ENUM.TRUE_FALSE_QUESTION:
          const correctAnswer = checkQuestion['correctAnswer']
          if (typeof userAnswer !== 'boolean')
            throw new BadRequestException(
              `Question id ${questionId} is of type true-false. Need userAnswer to be of type boolean. E.x: userAnswer: true`
            )
          isCorrect = correctAnswer === userAnswer
          break
        case TYPES_ENUM.CHOICE_QUESTION:
          if ((checkQuestion['chooseOne'] as boolean) === true) {
            if (typeof userAnswer !== 'number')
              throw new BadRequestException(
                `Question id ${questionId} is of type multiple-choice choose one. Need userAnswer to be of type number. E.x: userAnswer: 2`
              )
            isCorrect = userAnswer === checkQuestion['correctAnswers'][0]
          } else {
            if (
              !Array.isArray(userAnswer) ||
              !userAnswer.every((item) => typeof item === 'number')
            ) {
              throw new BadRequestException(
                `Question id ${questionId} is of type multiple-choice choose many. Need userAnswer to be of type number array. E.x: userAnswer: [0,2]`
              )
            }
            const userAnswersArr = (userAnswer as string[]).slice().sort()
            const checkAnswersArr = (checkQuestion['correctAnswers'] as string[]).slice().sort()
            isCorrect =
              userAnswersArr.length === checkAnswersArr.length &&
              userAnswersArr.every((value, index) => value === checkAnswersArr[index])
          }
          break
        case TYPES_ENUM.SHORT_ANSWER_QUESTION:
          const checkArray = userAnswer as string[]
          if (!Array.isArray(userAnswer) || !userAnswer.every((item) => typeof item === 'string')) {
            throw new BadRequestException(
              `Question id ${questionId} is of type short-answer. Need userAnswer to be of type string array. E.x: userAnswer: ["Option 1", "Option 2"]`
            )
          }
          isCorrect =
            checkArray.length === checkQuestion['correctAnswers'].length &&
            checkArray.every((value, index) => value === checkQuestion['correctAnswers'][index])
          break
      }

      totalPoint += isCorrect ? 1 : 0

      return {
        ...element,
        question: checkQuestion,
        isCorrect,
        explain: checkQuestion.answerExplain,
      }
    })

    attempt.completionTime = Math.floor((new Date().getTime() - attempt.createdAt.getTime()) / 1000)
    attempt.point = totalPoint
    attempt.isFinished = true

    // Set video finished
    const score: number = (attempt.point / exam.questionIds.length) * 100

    // In the future, we need to modify that code because it only supports exam in video => To finish video
    if (score >= exam.passPercentage) {
      await this.finishedVideoService.passExam(userId, attempt.videoId)
    }

    await this.attemptsRepository.save(attempt)
    return { ...attempt, userAnswers }
  }

  async removeExam(id: string) {
    const exam = await this.examsRepository.findOneBy({ id })
    if (!exam) throw new NotFoundException(`Exam with id ${id} not found`)

    return this.examsRepository.remove(exam)
  }

  // Check if user can pass exam of video
  async checkIfUserCanPassExam(userId: string, videoId: string, examId: string): Promise<boolean> {
    const attempt = await this.attemptsRepository.findOne({
      where: {
        userId,
        videoId,
        examId,
        isFinished: true,
      },
      order: {
        point: 'DESC',
      },
      relations: ['exam'],
    })

    if (!attempt) return false

    const score: number = (attempt.point / attempt.exam.questionIds.length) * 100

    return score >= attempt.exam.passPercentage
  }

  // Ranking
  async getAttemptRankingInVideoId(videoId: string): Promise<Attempt[]> {
    const attempts = await this.attemptsRepository.find({
      where: {
        videoId,
        isFinished: true,
      },
      order: {
        point: 'DESC',
        completionTime: 'ASC',
      },
      relations: ['user'],
    })

    const uniqueUserAttempts: Attempt[] = []
    const userIds = new Set<string>()

    const userAttemptsMap = new Map<string, Attempt>()

    for (const attempt of attempts) {
      if (!userIds.has(attempt.userId)) {
        uniqueUserAttempts.push(attempt)
        userIds.add(attempt.userId)
        userAttemptsMap.set(attempt.userId, attempt)
      }
    }

    uniqueUserAttempts.sort((a, b) => {
      if (a.point !== b.point) {
        return b.point - a.point
      }
      return a.completionTime - b.completionTime
    })

    return uniqueUserAttempts
  }
}
