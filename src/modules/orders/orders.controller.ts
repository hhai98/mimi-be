import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { OrdersService } from 'src/modules/orders/orders.service'
import { OrderQueryDto } from 'src/modules/orders/dto/order-query.dto'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { User } from 'src/modules/users/entities/user.entity'

@ApiBearerAuth()
@Roles(ROLE_ENUM.USER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'User - Create a new order' })
  @Post()
  create(@CurrentUser() user: User) {
    const userId = user.id
    return this.ordersService.createByUser(userId)
  }

  @ApiOperation({ summary: 'User - Create a new order from combo' })
  @Post('/combo/:comboId')
  createCombo(@Param('comboId') comboId: string, @CurrentUser() user: User) {
    const userId = user.id
    return this.ordersService.createComboByUser(comboId, userId)
  }

  @ApiOperation({ summary: 'User - Get user orders' })
  @Get()
  get(@CurrentUser() user: User, @Query() query: OrderQueryDto) {
    const userId = user.id
    return this.ordersService.findManyByUser(query, userId)
  }

  @ApiOperation({ summary: 'User - Get one order by id or order code' })
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const userId = user.id
    return this.ordersService.getOneUserOrder(id, userId)
  }
}
