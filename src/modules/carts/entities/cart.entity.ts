import { User } from 'src/modules/users/entities/user.entity'
import { CoreEntity } from 'src/utils/core/core-entity'
import { Column, ManyToOne } from 'typeorm'
import { Course } from 'src/modules/courses/entities/course.entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Cart extends CoreEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  course: Course

  @Column({ nullable: true })
  userId: string

  @Column({ nullable: true })
  courseId: string
}
