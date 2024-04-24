import { CoreEntity } from 'src/utils/core/core-entity'
import { Column, ManyToMany } from 'typeorm'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'
import { Order } from 'src/modules/orders/entities/order.entity'

@CoreEntityMixin()
export class Combo extends CoreEntity {
  @Column()
  title: string

  @Column({ nullable: true })
  background: string

  @Column('simple-array')
  courseIds: string[]

  @Column({ default: 0 })
  discount: number

  @Column({ default: false })
  isPublished: boolean

  @ManyToMany(() => Order, (order) => order.combos)
  orders: Order[]
}
