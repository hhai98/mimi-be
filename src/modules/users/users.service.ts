import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserWithEmailDto } from 'modules/users/dto/create-user-with-email.dto'
import { User } from 'modules/users/entities/user.entity'
import { CoreService } from 'src/utils/core/core-service'
import { isUUID } from 'class-validator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { STATUS_ENUM } from 'src/modules/users/enums/statuses.enum'
import { AuthUpdateDto } from 'src/modules/auth/dto/auth-update.dto'
import { AuthAdminUpdateUserDto } from 'src/modules/auth/dto/auth-admin-update-user.dto'

@Injectable()
export class UsersService extends CoreService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {
    super(usersRepository)
  }

  createWithEmail(createProfileDto: CreateUserWithEmailDto) {
    return this.create(createProfileDto)
  }

  findOneUser(value: string) {
    return this.usersRepository.findOneBy(isUUID(value) ? { id: value } : { username: value })
  }

  async createAdmin() {
    const countAdmin = await this.usersRepository.count({
      where: {
        role: ROLE_ENUM.ADMIN,
      },
    })

    if (countAdmin === 0) {
      return await this.usersRepository.save(
        this.usersRepository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: 'nguyencuong3012002@gmail.com',
          password: 'mimi@ABC',
          role: ROLE_ENUM.ADMIN,
          status: STATUS_ENUM.ACTIVE,
        })
      )
    }
  }

  async removeUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id })
    if (!user) throw new NotFoundException(`user with id ${id} not found`)

    return this.usersRepository.remove(user)
  }

  async updateByUser(userId: string, userDto: AuthUpdateDto) {
    // Check if the phone number already exists
    const existingUser = await this.usersRepository.findOne({
      where: { phoneNumber: userDto.phoneNumber },
    })

    // If an existing user is found and it's not the current user, throw an error
    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Số điện thoại đã tồn tại')
    }

    // Proceed with the update
    return this.update(userId, userDto)
  }

  async updateByAdmin(userId: string, userDto: AuthAdminUpdateUserDto) {
    // Check if the phone number already exists
    const existingUserByPhone =
      userDto.phoneNumber &&
      (await this.usersRepository.findOne({
        where: { phoneNumber: userDto.phoneNumber },
      }))

    // If an existing user is found by phone number and it's not the current user, throw an error
    if (existingUserByPhone && existingUserByPhone.id !== userId) {
      throw new ConflictException('Số điện thoại đã tồn tại')
    }

    // Check if the email already exists
    const existingUserByEmail =
      userDto.email &&
      (await this.usersRepository.findOne({
        where: { email: userDto.email },
      }))

    // If an existing user is found by email and it's not the current user, throw an error
    if (existingUserByEmail && existingUserByEmail.id !== userId) {
      throw new ConflictException('Email đã tồn tại')
    }

    // Proceed with the update
    return this.update(userId, userDto)
  }

  async blockUser(userId: string, isBlocked: boolean) {
    const user = await this.usersRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException(`user with id ${userId} not found`)

    user.isBlocked = isBlocked

    // if unblock user, reset ipList
    if (!isBlocked) user.ipList = null
    return this.usersRepository.save(user)
  }

  // function return statys block of user
  async getStatusBlock(userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException(`user with id ${userId} not found`)

    return { isBlocked: user.isBlocked }
  }
}
