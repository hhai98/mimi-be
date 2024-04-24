import { Controller, Get, Param, UseGuards, Query, HttpStatus, HttpCode } from '@nestjs/common'
import { CodesService } from 'modules/codes/codes.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'modules/roles/roles.guard'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { CoreQueryDto } from 'src/utils/core/core-query.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Codes')
@Controller('admin/codes')
export class AdminCodesController {
  constructor(private readonly codeService: CodesService) {}

  @ApiOperation({ summary: 'Admin - Get list code' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: CoreQueryDto) {
    return infinityPagination(
      await this.codeService.findManyWithPaginationWithDeleted(query),
      query
    )
  }

  @ApiOperation({ summary: 'Admin - Get one code by id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.codeService.findOne({ id })
  }
}
