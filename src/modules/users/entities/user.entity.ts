import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { STATUS_ENUM } from 'src/modules/users/enums/statuses.enum'
import { GENDER_ENUM } from 'modules/genders/genders.enum'
import { NUMBER } from 'constants/index'
import { Column, Index, BeforeInsert, OneToMany } from 'typeorm'
import { CoreEntity } from 'utils/core/core-entity'
import { AUTH_PROVIDER_ENUM } from 'modules/auth/auth-providers.enum'
import { Exclude, Expose, Transform } from 'class-transformer'
import { customAlphabet } from 'nanoid'
import { Course } from 'src/modules/courses/entities/course.entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function concatName(obj: any) {
  const firstName = obj.firstName || ''
  const lastName = obj.lastName || ''
  return firstName + ' ' + lastName
}

@CoreEntityMixin()
@Index(['socialId', 'provider'], { unique: true })
export class User extends CoreEntity {
  @Column({ nullable: true })
  @Expose()
  avatar: string | null

  @Column({ nullable: true })
  @Expose()
  background: string | null

  @Column({ nullable: true })
  @Expose()
  firstName: string | null

  @Column({ nullable: true })
  @Expose()
  lastName: string | null

  @Column({ nullable: true })
  @Expose()
  bio: string | null

  @Expose()
  @Transform(({ obj }) => concatName(obj))
  fullName: string | null

  @Column({ nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  dateOfBirth: Date | null

  @Column({ type: 'enum', enum: GENDER_ENUM, default: GENDER_ENUM.PRIVATE })
  @Expose({ groups: ['me', 'admin'] })
  gender: GENDER_ENUM

  @Column({ nullable: true })
  @Expose()
  district: string | null

  @Column({ unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null

  @Column({ unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  phoneNumber: string | null

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string | null

  @Column({ type: 'enum', enum: AUTH_PROVIDER_ENUM, default: AUTH_PROVIDER_ENUM.EMAIL })
  @Expose({ groups: ['me', 'admin'] })
  provider: AUTH_PROVIDER_ENUM

  @Column({ nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  socialId: string | null

  @Column({ unique: true })
  @Expose()
  @Index()
  username: string

  @Column('simple-array', { nullable: true })
  ipList: string[]

  @Column({ default: false })
  isBlocked: boolean

  @BeforeInsert()
  setUsername() {
    // if user login with social network, we will auto generate username
    // format: user_random
    if (this.username) return
    const nanoid = customAlphabet(NUMBER, 10)
    this.username = 'user_' + nanoid()
  }

  @Column({ type: 'enum', enum: ROLE_ENUM, default: ROLE_ENUM.USER })
  @Expose({ groups: ['admin'] })
  role: ROLE_ENUM

  @Column({ type: 'enum', enum: STATUS_ENUM, default: STATUS_ENUM.ACTIVE })
  @Expose({ groups: ['me', 'admin'] })
  status: STATUS_ENUM

  // relationship
  @OneToMany(() => Course, (course) => course.owner)
  courses: Course

  @OneToMany(() => Course, (course) => course.teacher)
  teachingCourses: Course[]
}
