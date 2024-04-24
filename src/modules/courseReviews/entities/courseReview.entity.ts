import { Expose } from 'class-transformer'
import { User } from 'src/modules/users/entities/user.entity'
import { CoreEntity } from 'src/utils/core/core-entity'
import { Column, ManyToOne } from 'typeorm'
import { Course } from 'src/modules/courses/entities/course.entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class CourseReview extends CoreEntity {
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  author: User

  @Column()
  authorId: string

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  course: Course

  @Column()
  courseId: string

  @Expose()
  @Column()
  content: string

  @Expose()
  @Column({ default: 5 })
  rating: number
}
