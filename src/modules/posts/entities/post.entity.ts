import { User } from 'src/modules/users/entities/user.entity'
import { CoreEntity } from 'src/utils/core/core-entity'
import { Column, ManyToOne } from 'typeorm'
import { Expose } from 'class-transformer'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Post extends CoreEntity {
  @ManyToOne(() => User, { eager: true, cascade: true })
  author: User

  @Column()
  authorId: string

  @Column({ nullable: true })
  title: string

  @Column({ nullable: true })
  cover: string

  @Expose()
  @Column()
  content: string

  @Column({ nullable: true })
  slug: string

  @Column({ default: false })
  isPublished: boolean

  @Column({ default: false })
  isFeatured: boolean
}
