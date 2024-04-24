import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { TeachersService } from 'src/modules/teachers/teachers.service'
import { CreateTeacherDto } from 'src/modules/teachers/dto/create-teacher.dto'
import { UpdateTeacherDto } from 'src/modules/teachers/dto/update-teacher.dto'
import { AdminTeacherQueryDto } from 'src/modules/teachers/dto/teacher-query.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Teachers')
@Controller('admin/teachers')
export class AdminTeacherController {
  constructor(private readonly teachersService: TeachersService) {}

  @ApiOperation({ summary: 'Admin - Get list of teachers' })
  @Get()
  findAll(@Query() query: AdminTeacherQueryDto) {
    return this.teachersService.findAll(query)
  }

  @ApiOperation({ summary: 'Admin - Get one teacher by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne({ id })
  }

  @ApiOperation({ summary: 'Admin - Create a new teacher' })
  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.createTeacher(createTeacherDto)
  }

  @ApiOperation({ summary: 'Admin - Update teacher' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(id, updateTeacherDto)
  }

  @ApiOperation({ summary: 'Admin - Delete teacher by id' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.teachersService.deleteTeacher(id)
  }
}
