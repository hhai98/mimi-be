import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { FinishedVideo } from 'src/modules/finishedVideos/entities/finishedVideo.entity'
import { Video } from 'src/modules/videos/entities/video.entity'

@Injectable()
export class FinishedVideosService extends CoreService<FinishedVideo> {
  constructor(
    @InjectRepository(FinishedVideo)
    private readonly finishedVideoRepository: Repository<FinishedVideo>
  ) {
    super(finishedVideoRepository)
  }

  async toggleFinished(userId: string, videoId: string) {
    const previousRecord = await this.finishedVideoRepository.findOneBy({ videoId, userId })
    if (!previousRecord) {
      const newRecord = this.finishedVideoRepository.create({ videoId, userId })
      return this.finishedVideoRepository.save(newRecord)
    }

    return await this.finishedVideoRepository.delete({ videoId, userId })
  }

  async checkVideoArrayFinish(videos: Video[], userId: string) {
    const result = await Promise.all(
      videos.map(async (video) => {
        const isFinished = await this.isFinished(userId, video.id)
        return { ...video, isFinished }
      })
    )

    return result
  }

  async isFinished(userId: string, videoId: string): Promise<boolean> {
    const record = await this.finishedVideoRepository.findOneBy({ userId, videoId })
    return !!record
  }

  async passExam(userId: string, videoId: string) {
    const isFinished = await this.isFinished(userId, videoId)
    if (!isFinished) {
      const newRecord = this.finishedVideoRepository.create({ videoId, userId })
      return this.finishedVideoRepository.save(newRecord)
    }
  }

  async getFinishedVideosCountInOneCourse(userId: string, courseId: string) {
    const finishedVideosCount = await this.finishedVideoRepository
      .createQueryBuilder('finishedVideo')
      .innerJoinAndSelect('finishedVideo.video', 'video')
      .innerJoinAndSelect('video.lesson', 'lesson')
      .innerJoinAndSelect('lesson.course', 'course')
      .where('finishedVideo.userId = :userId', { userId })
      .andWhere('course.id = :courseId', { courseId })
      .getCount()

    return finishedVideosCount
  }
}
