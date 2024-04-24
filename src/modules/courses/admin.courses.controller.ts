import { Controller, Get, Post, Body, UseGuards, Query, Param, Patch, Delete } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { CoursesService } from 'src/modules/courses/courses.service'
import { AddUserDto } from 'src/modules/courses/dto/add-user-to-course.dto'
import { AdminCourseQueryDto } from 'src/modules/courses/dto/course-query.dto'
import { CreateCourseDto } from 'src/modules/courses/dto/create-course.dto'
import { UpdateCourseDto } from 'src/modules/courses/dto/update-course.dto'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { User } from 'src/modules/users/entities/user.entity'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Courses')
@Controller('admin/courses')
export class AdminCoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @ApiOperation({ summary: 'Admin - Add user into course by userId' })
  @Post(':id/add-user')
  addUserToCourse(@Param('id') id: string, @Body() userList: AddUserDto) {
    return this.courseService.addUsersToCourse(id, userList)
  }

  @ApiOperation({ summary: 'Admin - Create a new course' })
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @CurrentUser() user: User) {
    const data = { ...createCourseDto, ownerId: user.id }
    return this.courseService.create(data)
  }

  @ApiOperation({ summary: 'Admin - Get list courses' })
  @Get()
  findAll(@Query() query: AdminCourseQueryDto) {
    return this.courseService.findManyByAdmin(query)
  }

  @ApiOperation({ summary: 'Admin - Get one course by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.getCourseDetailsByAdmin(id)
  }

  @ApiOperation({ summary: 'Admin - Update course by id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto)
  }

  @ApiOperation({ summary: 'Admin - Delete course by id' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.courseService.deleteCourse(id)
  }

  @ApiOperation({ summary: 'Admin - Get all enrolled courses of user' })
  @Get('users/:userId/enroll')
  getAllEnrolledCoursesOfUser(@Param('userId') id: string) {
    return this.courseService.getAllEnrolledCoursesOfUser(id)
  }
}
