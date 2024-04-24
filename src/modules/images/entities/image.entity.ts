import { CoreEntity } from 'src/utils/core/core-entity'
import { Column } from 'typeorm'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class Image extends CoreEntity {
  @Column({ nullable: true })
  url: string

  @Column({ nullable: true })
  order: number
}
