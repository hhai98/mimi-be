import { Lesson } from 'src/modules/lessons/entities/lesson.entity'
import { User } from 'src/modules/users/entities/user.entity'
import { BeforeInsert, Column, ManyToOne, OneToMany } from 'typeorm'
import { CoreEntity } from 'utils/core/core-entity'
import { customAlphabet } from 'nanoid'
import { NUMBER } from 'src/constants'
import { toLowerCaseNonAccentVietnamese } from 'src/utils'
import { Teacher } from 'src/modules/teachers/entities/teacher.entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Course extends CoreEntity {
  @Column()
  title: string

  @Column()
  slug: string

  @BeforeInsert()
  setSlug() {
    const nanoid = customAlphabet(NUMBER, 6)
    this.slug = toLowerCaseNonAccentVietnamese(this.title).replace(/ /g, '_') + '_' + nanoid()
  }

  @Column({ nullable: true })
  videoFeature: string

  @Column({ nullable: true })
  background: string

  @Column({ nullable: true })
  summary: string

  @Column({ nullable: true })
  benefits: string

  @Column({ default: false })
  isPublished: boolean

  @Column({ default: false })
  isFeatured: boolean

  @Column({ type: 'float', default: 0 })
  price: number

  @Column({ default: false })
  isFree: boolean

  // Thời hạn học tính theo tháng: 6 tháng, 12 tháng, 0: không có thời hạn
  @Column({ type: 'int', default: 0 })
  studyTerm: number

  @ManyToOne(() => User, (user) => user.courses)
  owner: User

  @Column({ nullable: true })
  ownerId: string

  @ManyToOne(() => Teacher, { eager: true })
  teacher: Teacher

  @Column({ nullable: true })
  teacherId: string

  @OneToMany(() => Lesson, (lesson) => lesson.course, { eager: true })
  lessons: Lesson[]
}
