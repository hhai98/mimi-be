import { CoreEntity } from 'src/utils/core/core-entity'
import { Column } from 'typeorm'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Exam extends CoreEntity {
  @Column()
  title: string

  @Column('simple-array')
  questionIds: string[]

  @Column({ type: 'int', default: 0 })
  passPercentage: number

  @Column({ nullable: true })
  audioUrl: string

  @Column({ nullable: true })
  description: string
}
