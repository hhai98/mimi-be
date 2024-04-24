import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { OrdersService } from 'src/modules/orders/orders.service'
import { OrderQueryDto } from 'src/modules/orders/dto/order-query.dto'
import { ConfirmOrderDto } from 'modules/orders/dto/update-status.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Orders')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Admin - Get list orders' })
  @Get()
  @SerializeOptions({
    groups: ['admin'],
  })
  findAll(@Query() query: OrderQueryDto) {
    return this.ordersService.findManyByAdmin(query)
  }

  @ApiOperation({ summary: 'Admin - Get one order by id' })
  @Get(':id')
  @SerializeOptions({
    groups: ['admin'],
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne({ id })
  }

  @ApiOperation({ summary: "Admin - Update order's status" })
  @Post('confirm')
  updateStatus(@Body() confirmOrderDto: ConfirmOrderDto) {
    return this.ordersService.confirmOrder(confirmOrderDto)
  }

  @ApiOperation({ summary: 'Admin - Get all order of user by userId' })
  @Get('users/:userId')
  getAllOrdersOfUser(@Param('userId') userId: string) {
    return this.ordersService.getAllOrdersOfUser(userId)
  }
}
