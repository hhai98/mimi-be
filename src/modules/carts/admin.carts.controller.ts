import { Controller, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { CartsService } from 'src/modules/carts/carts.service' // Updated import

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Carts') // Updated API tags
@Controller('admin/carts') // Updated route prefix
export class AdminCartsController {
  // Updated class name
  constructor(private readonly cartsService: CartsService) {} // Updated service variable name

  // Remove any unused methods or properties
}
