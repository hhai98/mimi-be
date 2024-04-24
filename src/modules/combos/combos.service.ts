import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { ILike, Repository } from 'typeorm'
import { Combo } from 'modules/combos/entities/combo.entity'
import { CoursesService } from 'src/modules/courses/courses.service'
import { ComboQueryDto } from 'src/modules/combos/dto/combo-query.dto'
import { EnrollmentService } from 'src/modules/enrollments/enrollment.service'
@Injectable()
export class CombosService extends CoreService<Combo> {
  constructor(
    @InjectRepository(Combo) private combosRepository: Repository<Combo>,
    private readonly coursesService: CoursesService,
    private readonly enrollmentService: EnrollmentService
  ) {
    super(combosRepository)
  }

  async findManyCombo(query: ComboQueryDto) {
    const { search } = { ...query }
    const [combos, count] = await this.combosRepository.findAndCount({
      where: {
        title: ILike(`%${search}%`),
      },
    })

    const data = await Promise.all(
      combos.map(async (combo) => {
        const courses = await this.coursesService.findCoursesFromIds(combo.courseIds)
        let totalPrice = 0
        const teacherIds = new Set()

        courses.forEach((course) => {
          totalPrice += course.price
          teacherIds.add(course.teacherId)
        })

        totalPrice = (totalPrice * (100 - combo.discount)) / 100.0

        return {
          ...combo,
          courses,
          totalPrice: Math.ceil(totalPrice),
          totalTeacher: teacherIds.size,
        }
      })
    )

    return { data, count }
  }

  async findManyComboByUser(query: ComboQueryDto) {
    const { search } = { ...query }
    const [combos, count] = await this.combosRepository.findAndCount({
      where: {
        title: ILike(`%${search}%`),
        isPublished: true,
      },
    })

    const data = await Promise.all(
      combos.map(async (combo) => {
        const courses = await this.coursesService.findCoursesFromIds(combo.courseIds)
        let totalPrice = 0
        const teacherIds = new Set()

        courses.forEach((course) => {
          totalPrice += course.price
          teacherIds.add(course.teacherId)
        })

        totalPrice = (totalPrice * (100 - combo.discount)) / 100.0

        return {
          ...combo,
          courses,
          totalPrice: Math.ceil(totalPrice),
          totalTeacher: teacherIds.size,
        }
      })
    )

    return { data, count }
  }

  async findOneCombo(id: string, userId: string) {
    const combo = await this.findOneWithDeleted({ id })

    const courses = await this.coursesService.findCoursesFromIds(combo.courseIds)
    const enrollCourses = await Promise.all(
      courses.map(async (course) => {
        const isEnrolled = await this.enrollmentService.isUserEnrolledCourse(userId, course.id)
        return { ...course, isEnrolled }
      })
    )

    let totalPrice = 0
    enrollCourses.forEach((course) => {
      if (!course.isEnrolled) totalPrice += course.price
    })
    totalPrice = (totalPrice * (100 - combo.discount)) / 100.0

    return { ...combo, courses: enrollCourses, totalPrice: Math.ceil(totalPrice) }
  }

  async findOneComboByUser(id: string, userId: string) {
    const combo = await this.combosRepository.findOne({
      where: {
        id,
        isPublished: true,
      },
    })

    const courses = await this.coursesService.findCoursesFromIds(combo.courseIds)
    const enrollCourses = await Promise.all(
      courses.map(async (course) => {
        const isEnrolled = await this.enrollmentService.isUserEnrolledCourse(userId, course.id)
        return { ...course, isEnrolled }
      })
    )

    let totalPrice = 0
    enrollCourses.forEach((course) => {
      if (!course.isEnrolled) totalPrice += course.price
    })
    totalPrice = (totalPrice * (100 - combo.discount)) / 100.0

    return { ...combo, courses: enrollCourses, totalPrice: Math.ceil(totalPrice) }
  }

  async removeCombo(id: string) {
    const combo = await this.combosRepository.findOneBy({ id })
    if (!combo) throw new NotFoundException(`Combo với ID ${id} không tìm thấy.`)

    return this.combosRepository.remove(combo)
  }
}
