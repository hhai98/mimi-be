import { User } from 'src/modules/users/entities/user.entity'
import { CoreEntity } from 'src/utils/core/core-entity'
import { Column, OneToOne, JoinColumn } from 'typeorm'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Teacher extends CoreEntity {
  @OneToOne(() => User, { cascade: true, eager: true })
  @JoinColumn()
  user: User

  @Column({ unique: true })
  userId: string

  @Column({ nullable: true })
  bio: string

  @Column({ nullable: true })
  facebookURL: string
}
