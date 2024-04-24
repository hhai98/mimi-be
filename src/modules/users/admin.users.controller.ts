import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Delete,
} from '@nestjs/common'
import { UsersService } from 'modules/users/users.service'
import { CreateUserWithEmailDto } from 'src/modules/users/dto/create-user-with-email.dto'
import { UpdateUserDto } from 'modules/users/dto/update-user.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'modules/roles/roles.guard'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { CoreQueryDto } from 'src/utils/core/core-query.dto'
import { BlockUserDto } from 'src/modules/users/dto/block-user.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Users')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Admin - Create a new user' })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserWithEmailDto) {
    return this.usersService.createWithEmail(createProfileDto)
  }

  @ApiOperation({ summary: 'Admin - Get list users' })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  async findAll(@Query() query: CoreQueryDto) {
    return infinityPagination(
      await this.usersService.findManyWithPaginationWithDeleted(query),
      query
    )
  }

  @ApiOperation({ summary: 'Admin - Get one user by id' })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id })
  }

  @ApiOperation({ summary: 'Admin - Update user' })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateUserDto) {
    return this.usersService.update(id, updateProfileDto)
  }

  @ApiOperation({ summary: 'Admin - Delete user by id' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.removeUser(id)
  }

  @ApiOperation({ summary: 'Admin - Block/Unblock user' })
  @Patch(':id/block')
  blockUser(@Param('id') id: string, @Body() blockUserDto: BlockUserDto) {
    return this.usersService.blockUser(id, blockUserDto.isBlocked)
  }

  // api get status block of user
  @ApiOperation({ summary: 'Admin - Get status block of user' })
  @Get(':id/block')
  getStatusBlock(@Param('id') id: string) {
    return this.usersService.getStatusBlock(id)
  }
}
