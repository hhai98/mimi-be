import { Module } from '@nestjs/common'
import { CartsService } from 'modules/carts/carts.service'
import { CartsController } from 'modules/carts/carts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cart } from 'modules/carts/entities/cart.entity'
import { AdminCartsController } from 'modules/carts/admin.carts.controller'
import { Course } from 'src/modules/courses/entities/course.entity'
import { EnrollmentModule } from 'src/modules/enrollments/enrollment.module'

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Course]), EnrollmentModule],
  controllers: [CartsController, AdminCartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
