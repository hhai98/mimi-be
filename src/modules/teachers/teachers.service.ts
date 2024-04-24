import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { Repository } from 'typeorm'
import { Teacher } from 'src/modules/teachers/entities/teacher.entity'
import { AdminTeacherQueryDto } from 'src/modules/teachers/dto/teacher-query.dto'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { CreateTeacherDto } from 'src/modules/teachers/dto/create-teacher.dto'

@Injectable()
export class TeachersService extends CoreService<Teacher> {
  constructor(@InjectRepository(Teacher) private teachersRepository: Repository<Teacher>) {
    super(teachersRepository)
  }

  async findAll(query: AdminTeacherQueryDto) {
    // const { search } = { ...query }
    // eslint-disable-next-line prefer-const
    let [data, count] = await this.repo.findAndCount({
      relations: {
        user: true,
      },
    })

    // if (search) {
    //   data = data.filter((item) => {
    //     let fullName = item.user.firstName + ' ' + item.user.lastName
    //     fullName = fullName.toLowerCase()
    //     return fullName.includes(search.toLowerCase())
    //   })
    // }
    return infinityPagination({ data, count }, query)
  }

  async deleteTeacher(id: string) {
    const teacher = await this.teachersRepository.findOneBy({ id })

    if (!teacher) throw new NotFoundException(`Teacher with id ${id} not exist`)

    return this.teachersRepository.remove(teacher)
  }

  async checkUserIdExists(userId: string): Promise<boolean> {
    const existingTeacher = await this.teachersRepository.findOne({ where: { userId } })
    return !!existingTeacher
  }

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const { userId } = createTeacherDto
    const userIdExists = await this.checkUserIdExists(userId)
    if (userIdExists) {
      throw new NotFoundException('Giáo viên đã tồn tại. Vui lòng chọn user khác.')
    }

    const teacher = this.teachersRepository.create(createTeacherDto)
    return await this.teachersRepository.save(teacher)
  }
}
