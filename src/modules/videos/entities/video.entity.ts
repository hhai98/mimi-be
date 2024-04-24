import { Lesson } from 'src/modules/lessons/entities/lesson.entity'
import { BeforeInsert, BeforeUpdate, Column, ManyToOne, OneToMany } from 'typeorm'
import { CoreEntity } from 'utils/core/core-entity'
import axios from 'axios'
import { BadRequestException } from '@nestjs/common'
import { Comment } from 'src/modules/comments/entities/comment.entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Video extends CoreEntity {
  @Column()
  title: string

  @Column()
  link: string

  @Column({ default: false })
  isPublished: boolean

  @Column({ default: false })
  isFree: boolean

  @Column({ default: 0 })
  duration: number

  @Column({ default: null })
  examId: string

  @ManyToOne(() => Lesson, (lesson) => lesson.videos, { onDelete: 'CASCADE' })
  lesson: Lesson

  @Column({ nullable: true })
  lessonId: string

  @OneToMany(() => Comment, (comment) => comment.video)
  comments: Comment[]

  @BeforeInsert()
  @BeforeUpdate()
  async setVideoDuration() {
    const videoId = this.extractVideoIdFromLink(this.link)

    if (!videoId) {
      throw new BadRequestException('Link video không đúng')
    }

    const apiKey = 'AIzaSyCQUxS9vU6OLsogUJnf1ByyHeRfjGSnxsU'
    const videoDetails = await this.fetchVideoDetails(videoId, apiKey)
    if (!videoDetails || !videoDetails.duration) {
      throw new BadRequestException('Không thể lấy thời lượng video')
    }

    this.duration = this.parseDuration(videoDetails.duration)
  }

  private extractVideoIdFromLink(link: string): string | null {
    const match = link.match(/[?&]v=([^?&]+)/)
    return match ? match[1] : null
  }

  private async fetchVideoDetails(videoId: string, apiKey: string) {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        id: videoId,
        part: 'contentDetails',
        key: apiKey,
      },
    })

    if (response.data.items.length > 0) {
      return response.data.items[0].contentDetails
    }

    return null
  }

  private parseDuration(duration: string): number {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    const match = duration.match(regex)

    if (match) {
      const hours = match[1] ? parseInt(match[1], 10) : 0
      const minutes = match[2] ? parseInt(match[2], 10) : 0
      const seconds = match[3] ? parseInt(match[3], 10) : 0

      // Calculate the total duration in minutes
      const totalMinutes = hours * 60 + minutes + Math.ceil(seconds / 60)
      return totalMinutes
    }

    return 0 // Return 0 if the format doesn't match
  }
}
