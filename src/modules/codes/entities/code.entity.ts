import { CODE_TYPE_ENUM } from 'modules/codes/codes.enum'
import { CoreEntity } from 'utils/core/core-entity'
import { Column, Index } from 'typeorm'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Code extends CoreEntity {
  @Column()
  @Index()
  value: string

  @Column({ type: 'enum', enum: CODE_TYPE_ENUM })
  type: CODE_TYPE_ENUM

  @Column({ nullable: true })
  email: string | null

  @Column({ nullable: true })
  phoneNumber: string | null

  @Column({ default: false })
  @Index()
  isUsed: boolean

  @Column()
  @Index()
  expiresAt: Date
}
