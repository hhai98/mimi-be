import { Injectable } from '@nestjs/common'
import { CoursesService } from 'src/modules/courses/courses.service'
import { EnrollmentService } from 'src/modules/enrollments/enrollment.service'
import { OrdersService } from 'src/modules/orders/orders.service'
import { EnrollmentQueryDto } from 'src/modules/enrollments/dto/enrollment-query.dto'
import { UsersService } from 'src/modules/users/users.service'

@Injectable()
export class StatisticsService {
  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
    private ordersService: OrdersService,
    private enrollmentsService: EnrollmentService
  ) {}

  async getSummary() {
    const [countUser, countCourse, totalPrice, countOrder] = await Promise.all([
      this.usersService.getTotalCount(),
      this.coursesService.getTotalCount(),
      this.ordersService.getTotalPriceSum(),
      this.ordersService.getTotalCount(),
    ])

    return { countUser, countOrder, countCourse, totalPrice }
  }

  getStudyProgress(query: EnrollmentQueryDto) {
    return this.enrollmentsService.getListStudyProgress(query)
  }
}
