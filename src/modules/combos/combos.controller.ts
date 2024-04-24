import { Controller, Get, Headers, Param, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CombosService } from 'src/modules/combos/combos.service'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { ComboQueryDto } from 'src/modules/combos/dto/combo-query.dto'
import { AuthService } from 'src/modules/auth/auth.service'

@ApiBearerAuth()
@ApiTags('Combos')
@Controller('combos')
export class CombosController {
  constructor(
    private readonly combosService: CombosService,
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ summary: 'User - Get list of combos' })
  @Get()
  async findAll(@Query() query: ComboQueryDto) {
    return infinityPagination(await this.combosService.findManyComboByUser(query), query)
  }

  @ApiOperation({ summary: 'User - Get one combo by id' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Headers('authorization') headers) {
    let userId = null

    try {
      const user = headers ? await this.authService.validateJwtToken(headers.split(' ')[1]) : null
      userId = user ? user.id : null
    } catch (error) {
      // Handle invalid token here
      userId = null
    }
    return this.combosService.findOneComboByUser(id, userId)
  }
}
