import { Module } from '@nestjs/common'
import { StatisticsService } from 'src/modules/statistics/statistics.service'
import { AdminStatisticsController } from 'src/modules/statistics/admin.statistics.controller'
import { UsersModule } from 'src/modules/users/users.module'
import { OrdersModule } from 'src/modules/orders/orders.module'
import { CoursesModule } from 'src/modules/courses/courses.module'
import { EnrollmentModule } from 'src/modules/enrollments/enrollment.module'

@Module({
  imports: [UsersModule, OrdersModule, CoursesModule, EnrollmentModule],
  controllers: [AdminStatisticsController],
  providers: [StatisticsService],
})
export class StatisticModule {}
