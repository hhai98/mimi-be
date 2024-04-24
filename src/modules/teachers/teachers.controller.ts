import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AdminTeacherQueryDto } from 'src/modules/teachers/dto/teacher-query.dto'
import { TeachersService } from 'src/modules/teachers/teachers.service'

@ApiTags('Teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teachersService: TeachersService) {}

  @ApiOperation({ summary: 'User - Get list of teachers' })
  @Get()
  findAll(@Query() query: AdminTeacherQueryDto) {
    return this.teachersService.findAll(query)
  }

  @ApiOperation({ summary: 'User - Get one teacher by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne({ id })
  }
}
