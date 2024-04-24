import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { STATUS_ENUM } from 'src/modules/users/enums/statuses.enum'
import { User } from 'modules/users/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: ROLE_ENUM.ADMIN,
      },
    })

    if (countAdmin === 0) {
      await this.repository.save(
        this.repository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: '',
          password: '',
          role: ROLE_ENUM.ADMIN,
          status: STATUS_ENUM.ACTIVE,
        })
      )
    }

    const countUser = await this.repository.count({
      where: {
        role: ROLE_ENUM.USER,
      },
    })

    if (countUser === 0) {
      await this.repository.save(
        this.repository.create({
          firstName: 'John',
          lastName: 'Doe',
          email: '',
          password: 'secret',
          role: ROLE_ENUM.USER,
          status: STATUS_ENUM.ACTIVE,
        })
      )
    }
  }
}
