import { Column, ManyToOne, OneToMany } from 'typeorm'
import { User } from 'src/modules/users/entities/user.entity'
import { Video } from 'src/modules/videos/entities/video.entity'
import { CoreEntity } from 'src/utils/core/core-entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Comment extends CoreEntity {
  @Column()
  videoId: string

  @Column({ nullable: true })
  authorId: string

  @ManyToOne(() => Comment, (comment) => comment.children, { cascade: true })
  parent: Comment

  @Column({ nullable: true })
  parentId: string

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[]

  @Column()
  content: string

  @ManyToOne(() => User, { eager: true, cascade: true })
  author: User

  @ManyToOne(() => Video, (video) => video.comments, { cascade: true })
  video: Video
}
