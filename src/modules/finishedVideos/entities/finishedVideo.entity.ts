import { Column, ManyToOne } from 'typeorm'
import { CoreEntity } from 'utils/core/core-entity'
import { User } from 'src/modules/users/entities/user.entity'
import { Video } from 'src/modules/videos/entities/video.entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class FinishedVideo extends CoreEntity {
  @ManyToOne(() => User, { cascade: true })
  user: User

  @ManyToOne(() => Video, { cascade: true })
  video: Video

  @Column()
  userId: string

  @Column()
  videoId: string
}
