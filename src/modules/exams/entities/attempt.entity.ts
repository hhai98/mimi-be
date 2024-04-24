import { Exam } from 'src/modules/exams/entities/exam.entity'
import { User } from 'src/modules/users/entities/user.entity'
import { Video } from 'src/modules/videos/entities/video.entity'
import { CoreEntity } from 'src/utils/core/core-entity'
import { Column, ManyToOne } from 'typeorm'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Attempt extends CoreEntity {
  @ManyToOne(() => User)
  user: User

  @Column()
  userId: string

  @ManyToOne(() => Exam)
  exam: Exam

  @Column()
  examId: string

  @ManyToOne(() => Video, { nullable: true })
  video: Video

  @Column({ nullable: true })
  videoId: string

  @Column({ default: 0 })
  point: number

  @Column({ default: 0 })
  completionTime: number

  @Column({ default: false })
  isFinished: boolean
}
