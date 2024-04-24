import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { CartsService } from 'src/modules/carts/carts.service'
import { AddCourseDto } from 'src/modules/carts/dto/add-course.dto'
import { User } from 'src/modules/users/entities/user.entity'

@ApiBearerAuth()
@Roles(ROLE_ENUM.USER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({ summary: 'User - Get cart' })
  @Get()
  get(@CurrentUser() user: User) {
    const userId = user.id
    return this.cartsService.getCart(userId)
  }

  @ApiOperation({ summary: 'User - Add course to cart' })
  @Post()
  create(@Body() addCourseDto: AddCourseDto, @CurrentUser() user: User) {
    const userId = user.id
    return this.cartsService.createByUser(addCourseDto, userId)
  }

  @ApiOperation({ summary: 'User - Remove course from cart' })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    const userId = user.id
    return this.cartsService.removeCourse(id, userId)
  }
}
