import { User } from 'src/modules/users/entities/user.entity'
import { Column, ManyToOne } from 'typeorm'
import { CoreEntity } from 'utils/core/core-entity'
import { Course } from 'src/modules/courses/entities/course.entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Enrollment extends CoreEntity {
  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  course: Course

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @Column()
  courseId: string

  @Column()
  userId: string
}
