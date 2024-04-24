import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { Repository } from 'typeorm'
import { Order } from 'modules/orders/entities/order.entity'
import { OrderQueryDto } from 'src/modules/orders/dto/order-query.dto'
import { CartsService } from 'src/modules/carts/carts.service'
import { ConfirmOrderDto } from 'src/modules/orders/dto/update-status.dto'
import { STATUS_ENUM } from 'src/modules/orders/enums/statuses.enum'
import { MailService } from 'src/modules/mail/mail.service'
import { OrderItem } from 'src/modules/orders/entities/orderItem.entity'
import { Course } from 'src/modules/courses/entities/course.entity'
import { CombosService } from 'src/modules/combos/combos.service'
import { EnrollmentService } from 'src/modules/enrollments/enrollment.service'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { isUUID } from 'class-validator'

@Injectable()
export class OrdersService extends CoreService<Order> {
  // Changed the class name
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
    @InjectRepository(OrderItem) private orderItemsRepository: Repository<OrderItem>,
    private readonly enrollmentService: EnrollmentService,
    private readonly mailService: MailService,
    private readonly cartsService: CartsService,
    private readonly combosService: CombosService
  ) {
    super(ordersRepository)
  }

  async getTotalPriceSum(): Promise<number> {
    const result = await this.ordersRepository
      .createQueryBuilder()
      .select('SUM("totalPrice")', 'totalPriceSum')
      .where('order.status = :status', { status: STATUS_ENUM.ACCEPTED })
      .getRawOne()

    return result.totalPriceSum || 0
  }

  async findManyByUser(query: OrderQueryDto, userId: string) {
    const { page, limit, status } = query

    const [data, count] = await this.ordersRepository.findAndCount({
      relations: {
        orderItems: true,
        user: true,
      },
      where: {
        status,
        user: {
          id: userId,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return infinityPagination({ data, count }, query)
  }

  async findManyByAdmin(query: OrderQueryDto) {
    const { page, limit, status } = query

    const [data, count] = await this.ordersRepository.findAndCount({
      relations: {
        orderItems: true,
        user: true,
      },
      where: {
        status,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return infinityPagination({ data, count }, query)
  }

  async createByUser(userId: string) {
    const { courses, totalPrice } = await this.cartsService.getCart(userId)
    if (courses.length === 0) throw new BadRequestException('Giỏ hàng của bạn đang trống')

    const order = this.ordersRepository.create({
      userId,
      totalPrice,
    })

    await this.ordersRepository.save(order)

    for (const item of courses) {
      const orderItem = this.orderItemsRepository.create({
        orderId: order.id,
        courseId: item.id,
        title: item.title,
        price: item.price,
      })
      await this.orderItemsRepository.save(orderItem)
    }

    await this.cartsService.clearCart(userId)

    return await this.ordersRepository.findOne({
      where: { id: order.id },
      relations: {
        orderItems: true,
      },
    })
  }

  async createComboByUser(comboId: string, userId: string) {
    const combo = await this.combosService.findOneCombo(comboId, userId)
    if (combo.totalPrice === 0)
      throw new BadRequestException('Bạn đã tham gia tất cả khóa học trong combo này.')

    const order = this.ordersRepository.create({
      userId,
      totalPrice: combo.totalPrice,
    })

    await this.ordersRepository.save(order)
    await Promise.all(
      combo.courses.map(async (course) => {
        if (course.isEnrolled) return
        const orderItem = this.orderItemsRepository.create({
          orderId: order.id,
          title: course.title,
          price: course.price,
        })

        return await this.orderItemsRepository.save(orderItem)
      })
    )

    const resultOrder = await this.ordersRepository.findOne({
      where: { id: order.id },
      relations: {
        orderItems: true,
      },
    })

    return { ...resultOrder, combos: combo }
  }

  getUserOrders(userId: string) {
    return this.ordersRepository.findBy({ userId })
  }

  async getOneUserOrder(id: string, userId: string) {
    const isIdUUID = isUUID(id)

    // Search for order based on either id or orderCode
    const order = await this.ordersRepository.findOne({
      where: isIdUUID ? { id, userId } : { orderCode: id, userId },
    })
    if (!order) throw new NotFoundException(`Order with id ${id} not found`)
    return order
  }

  async confirmOrder(confirmOrderDto: ConfirmOrderDto) {
    const { orderId, confirm } = { ...confirmOrderDto }
    //Get order
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.id = :orderId', { orderId })
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('order.user', 'user')
      .getOne()
    if (!order) throw new NotFoundException(`Order with id ${orderId} not exist`)

    if (order.status === STATUS_ENUM.ACCEPTED) return order

    if (!confirm) {
      order.status = STATUS_ENUM.CANCELLED
      return this.ordersRepository.save(order)
    }

    order.orderItems.forEach(async (item) => {
      await this.enrollmentService.addEnrolledCourse(order.userId, item.courseId)
    })

    this.mailService.activateCourses({
      to: order.user.email,
      data: {
        courses: order.orderItems,
        user: order.user,
      },
    })

    order.status = STATUS_ENUM.ACCEPTED
    return this.ordersRepository.save(order)
  }

  async deleteOrder(id: string) {
    const order = await this.ordersRepository.findOneBy({ id })
    if (!order) throw new NotFoundException(`Order with id ${id} not exist`)

    return this.ordersRepository.remove(order)
  }

  getAllOrdersOfUser(userId: string) {
    return this.ordersRepository.find({
      where: { userId },
    })
  }
}
