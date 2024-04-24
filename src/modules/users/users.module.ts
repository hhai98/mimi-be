import { Module } from '@nestjs/common'
import { UsersService } from 'modules/users/users.service'
import { UsersController } from 'modules/users/users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'modules/users/entities/user.entity'
import { IsExist } from 'src/utils/validators/is-exists.validator'
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator'
import { AdminUsersController } from 'src/modules/users/admin.users.controller'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, AdminUsersController],
  providers: [IsExist, IsNotExist, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
