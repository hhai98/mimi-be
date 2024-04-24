import { Course } from 'src/modules/courses/entities/course.entity'
import { Video } from 'src/modules/videos/entities/video.entity'
import { Column, ManyToOne, OneToMany } from 'typeorm'
import { CoreEntity } from 'utils/core/core-entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Lesson extends CoreEntity {
  @Column()
  title: string

  @Column({ default: 0 })
  duration: number

  @Column({ default: false })
  isPublished: boolean

  @ManyToOne(() => Course, (course) => course.lessons, { cascade: true })
  course: Course

  @OneToMany(() => Video, (video) => video.lesson, { eager: true })
  videos: Video[]

  @Column({ nullable: true })
  courseId: string
}
