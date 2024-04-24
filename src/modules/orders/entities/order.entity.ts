import { User } from 'src/modules/users/entities/user.entity'
import { CoreEntity } from 'src/utils/core/core-entity'
import { BeforeInsert, Column, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { STATUS_ENUM } from 'modules/orders/enums/statuses.enum'
import { OrderItem } from 'src/modules/orders/entities/orderItem.entity'
import { Combo } from 'src/modules/combos/entities/combo.entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'
import { NUMBER } from 'src/constants'
import { customAlphabet } from 'nanoid'

@CoreEntityMixin()
export class Order extends CoreEntity {
  @ManyToOne(() => User, { eager: true, onDelete: 'SET NULL' })
  user: User

  @Column()
  userId: string

  @Column({ type: 'enum', enum: STATUS_ENUM, default: STATUS_ENUM.PENDING })
  status: STATUS_ENUM

  @Column()
  totalPrice: number

  @ManyToMany(() => Combo, (combo) => combo.orders)
  combos: Combo[]

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
  orderItems: OrderItem[]

  @Column({ unique: true, nullable: true })
  orderCode: string

  @BeforeInsert()
  setOrderCode() {
    if (this.orderCode) return
    const nanoid = customAlphabet(NUMBER, 6)
    this.orderCode = nanoid()
  }
}
