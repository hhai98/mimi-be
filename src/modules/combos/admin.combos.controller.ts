import { Controller, Get, Post, Body, UseGuards, Query, Param, Patch, Delete } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { CombosService } from 'src/modules/combos/combos.service'
import { ComboQueryDto } from 'src/modules/combos/dto/combo-query.dto'
import { Roles } from 'src/modules/roles/roles.decorator'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { infinityPagination } from 'src/utils/infinity-pagination'
import { CreateComboDto } from 'src/modules/combos/dto/create-combo.dto'
import { UpdateComboDto } from 'src/modules/combos/dto/update-combo.dto'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { CoursesService } from 'src/modules/courses/courses.service'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Combos')
@Controller('admin/combos')
export class AdminCombosController {
  constructor(
    private readonly combosService: CombosService,
    private readonly coursesService: CoursesService
  ) {}

  @ApiOperation({ summary: 'Admin - Create a new combo' })
  @Post()
  async create(@Body() createComboDto: CreateComboDto) {
    await this.coursesService.validateCoursesFromIds(createComboDto.courseIds)
    return this.combosService.create(createComboDto)
  }

  @ApiOperation({ summary: 'Admin - Get list of combos' })
  @Get()
  async findAll(@Query() query: ComboQueryDto) {
    return infinityPagination(await this.combosService.findManyCombo(query), query)
  }

  @ApiOperation({ summary: 'Admin - Get one combo by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.combosService.findOneCombo(id, null)
  }

  @ApiOperation({ summary: 'Admin - Update combo by id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComboDto: UpdateComboDto) {
    return this.combosService.update(id, updateComboDto)
  }

  @ApiOperation({ summary: 'Admin - Delete combo by id' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.combosService.removeCombo(id)
  }
}
