import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { Video } from 'src/modules/videos/entities/video.entity'
import { LessonsService } from 'src/modules/lessons/lessons.service'
import { CreateVideoDto } from 'src/modules/videos/dto/create-video.dto'
import { UpdateVideoDto } from 'src/modules/videos/dto/update-video.dto'
import { EnrollmentService } from 'src/modules/enrollments/enrollment.service'
import { FinishedVideosService } from 'src/modules/finishedVideos/finishedVideos.service'
import { Exam } from 'src/modules/exams/entities/exam.entity'
import { AdminVideoQueryDto } from 'src/modules/videos/dto/video-query.dto'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { ExamsService } from 'src/modules/exams/exams.service'

@Injectable()
export class VideosService extends CoreService<Video> {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    private readonly lessonsService: LessonsService,
    private readonly enrollmentService: EnrollmentService,
    private readonly finishedVideoService: FinishedVideosService,
    private readonly examsService: ExamsService
  ) {
    super(videoRepository)
  }

  async findManyByAdmin(query: AdminVideoQueryDto) {
    const { limit, page, search, isPublished } = { ...query }
    const [data, count] = await this.repo.findAndCount({
      where: {
        title: ILike(`%${search}%`),
        isPublished,
      },
      skip: (page - 1) * limit,
      take: limit,
    })
    return infinityPagination({ data, count }, query)
  }

  async createNewVideo(createVideoDto: CreateVideoDto) {
    const video = this.videoRepository.create(createVideoDto)

    if (createVideoDto.examId) {
      const exam = await this.examRepository.findOneBy({ id: createVideoDto.examId })
      if (!exam) throw new NotFoundException(`Exam with id ${createVideoDto.examId} not found`)
    }
    await this.videoRepository.save(video)
    await this.lessonsService.updateLessonDuration(video.lessonId)
    return video
  }

  async updateVideo(id: string, updateVideoDto: UpdateVideoDto) {
    const video = await this.videoRepository.findOneBy({ id })
    if (!video) throw new NotFoundException(`Video with ${id} not found`)

    const examId = updateVideoDto.examId
    if (examId) {
      const exam = await this.examRepository.findOneBy({ id: examId })
      if (!exam) throw new NotFoundException(`Exam with id ${examId} not found`)
    }
    this.videoRepository.merge(video, updateVideoDto)
    await this.videoRepository.save(video)
    await this.lessonsService.updateLessonDuration(video.lessonId)
    return video
  }

  async getVideoDetails(id: string, userId: string) {
    const video = await this.videoRepository
      .createQueryBuilder('video')
      .where('video.id = :id', { id })
      .getOne()

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`)
    }

    if (!video.isFree) {
      const lesson = await this.lessonsService.findOne({ id: video.lessonId })
      const isEnroll = await this.enrollmentService.isUserEnrolledCourse(userId, lesson.courseId)
      if (!isEnroll) video.link = null
    }

    if (userId) {
      const isFinished = await this.finishedVideoService.isFinished(userId, video.id)
      return { ...video, isFinished }
    }

    return video
  }

  async toggleFinished(videoId: string, userId: string) {
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['lesson'],
    })
    if (!video) throw new NotFoundException(`Video with id ${videoId} not found`)

    // First check enrollment
    const isEnroll = await this.enrollmentService.isUserEnrolledCourse(
      userId,
      video.lesson.courseId
    )

    if (!isEnroll)
      throw new BadRequestException(
        'Bạn phải tham gia khóa học trước khi đánh dấu video này là đã hoàn thành.'
      )

    // Case: Video is already finished, then user can mark it as unfinished
    if (this.finishedVideoService.isFinished(userId, videoId)) {
      return this.finishedVideoService.toggleFinished(userId, videoId)
    }

    // Case: Video is not finished
    // If video requires an exam to pass, then the user must pass the exam first
    if (video.examId) {
      const exam = await this.examRepository.findOneBy({ id: video.examId })

      if (!exam) throw new NotFoundException(`Exam with id ${video.examId} not found`)

      // If percentage is 0 => can mark as finished
      // If percentage is not 0 => check attempt to see if user has passed the exam
      if (
        exam.passPercentage !== 0 &&
        this.examsService.checkIfUserCanPassExam(userId, videoId, video.examId)
      ) {
        throw new BadRequestException(
          'Bạn phải vượt qua bài kiểm tra trước khi đánh dấu video này là đã hoàn thành.'
        )
      }
    }

    return this.finishedVideoService.toggleFinished(userId, videoId)
  }

  async deleteVideo(id: string) {
    const video = await this.videoRepository.findOneBy({ id })

    if (!video) throw new NotFoundException(`Video with id ${id} not exist`)
    await this.videoRepository.remove(video)
    await this.lessonsService.updateLessonDuration(video.lessonId)
    return video
  }
}
