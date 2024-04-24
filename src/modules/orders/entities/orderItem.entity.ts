import { CoreEntity } from 'src/utils/core/core-entity'
import { Column, ManyToOne } from 'typeorm'
import { Order } from 'src/modules/orders/entities/order.entity'
import { Course } from 'src/modules/courses/entities/course.entity'
import { CoreEntityMixin } from 'src/utils/core/core-entity.mixin'

@CoreEntityMixin()
export class OrderItem extends CoreEntity {
  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order

  @Column()
  orderId: string

  @ManyToOne(() => Course, { onDelete: 'SET NULL' })
  course: Course

  @Column({ nullable: true })
  courseId: string

  @Column()
  title: string

  @Column({ type: 'float', default: 0 })
  price: number
}
