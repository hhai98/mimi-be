import { Controller, Get, Param } from '@nestjs/common'
import { UsersService } from 'modules/users/users.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'User - Create admin' })
  @Get('create-admin')
  createAdmin() {
    return this.usersService.createAdmin()
  }

  @ApiOperation({ summary: "User - Get user's information by id or username" })
  @Get(':value')
  findOne(@Param('value') value: string) {
    // we can find user by username and id
    return this.usersService.findOneUser(value)
  }
}
