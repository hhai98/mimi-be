import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { Repository } from 'typeorm'
import { Cart } from 'modules/carts/entities/cart.entity'
import { AddCourseDto } from 'src/modules/carts/dto/add-course.dto'
import { Course } from 'src/modules/courses/entities/course.entity'
import { EnrollmentService } from 'src/modules/enrollments/enrollment.service'

@Injectable()
export class CartsService extends CoreService<Cart> {
  constructor(
    @InjectRepository(Cart) private cartsRepository: Repository<Cart>,
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
    private readonly enrollmentService: EnrollmentService
  ) {
    super(cartsRepository)
  }

  async getCart(userId: string) {
    const carts = await this.cartsRepository.find({
      where: { userId },
      relations: {
        course: true,
      },
      loadEagerRelations: false,
    })

    // Extract the courses from the carts
    const courses = carts.map((cart) => cart.course)
    const totalPrice = this.calculateTotalPrice(carts)

    return { courses, totalPrice }
  }

  async createByUser(addCourseDto: AddCourseDto, userId: string) {
    const course = await this.coursesRepository.findOneBy({ id: addCourseDto.courseId })
    if (!course)
      throw new NotFoundException(`Khóa học với id ${addCourseDto.courseId} không tồn tại`)
    const previousItem = await this.cartsRepository.findOneBy({
      userId,
      courseId: addCourseDto.courseId,
    })

    if (previousItem) return previousItem

    const isEnroll = await this.enrollmentService.isUserEnrolledCourse(
      userId,
      addCourseDto.courseId
    )

    if (isEnroll)
      throw new BadRequestException(
        `Khóa học với id ${addCourseDto.courseId} đã được tham gia. Không cho phép mua lại.`
      )

    const cartItem = this.cartsRepository.create({
      userId,
      courseId: addCourseDto.courseId,
    })

    return this.cartsRepository.save(cartItem)
  }

  async removeCourse(courseId: string, userId: string) {
    const cartItem = await this.cartsRepository.findOneBy({
      userId,
      courseId,
    })
    if (!cartItem) throw new NotFoundException(`Khóa học với ID ${courseId} không tìm thấy.`)

    return this.cartsRepository.remove(cartItem)
  }

  calculateTotalPrice(carts: Cart[]): number {
    let totalPrice = 0
    carts.forEach((cart) => {
      if (cart.course && cart.course.price) {
        totalPrice += cart.course.price
      }
    })
    return totalPrice
  }

  async clearCart(userId: string) {
    await this.cartsRepository.delete({ userId })
  }
}
