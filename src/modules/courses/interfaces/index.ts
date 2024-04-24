import { Video } from 'src/modules/videos/entities/video.entity'
import { Lesson } from 'src/modules/lessons/entities/lesson.entity'

export interface IVideoWithMoreInfo extends Video {
  isFinished?: boolean
}

export interface ILessonWithMoreInfo extends Lesson {
  videos: IVideoWithMoreInfo[]
}
