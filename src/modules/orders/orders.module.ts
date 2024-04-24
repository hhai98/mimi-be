import { Module } from '@nestjs/common'
import { OrdersService } from 'modules/orders/orders.service'
import { OrdersController } from 'modules/orders/orders.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from 'modules/orders/entities/order.entity'
import { AdminOrdersController } from 'modules/orders/admin.orders.controller'
import { OrderItem } from 'src/modules/orders/entities/orderItem.entity'
import { MailService } from 'src/modules/mail/mail.service'
import { Course } from 'src/modules/courses/entities/course.entity'
import { CombosModule } from 'src/modules/combos/combos.module'
import { CartsModule } from 'src/modules/carts/carts.module'
import { EnrollmentModule } from 'src/modules/enrollments/enrollment.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Course]),
    CartsModule,
    CombosModule,
    EnrollmentModule,
  ],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService, MailService],
  exports: [OrdersService],
})
export class OrdersModule {}
