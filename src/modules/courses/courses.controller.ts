import { Controller, Get, Query, Param, UseGuards, Headers } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { AuthService } from 'src/modules/auth/auth.service'
import { CoursesService } from 'src/modules/courses/courses.service'
import { UserCourseQueryDto } from 'src/modules/courses/dto/course-query.dto'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { User } from 'src/modules/users/entities/user.entity'

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ summary: 'User - Get list courses' })
  @Get()
  findAll(@Query() query: UserCourseQueryDto) {
    return this.coursesService.findManyByUser(query)
  }

  @ApiBearerAuth()
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'User - Get enroll courses' })
  @Get('/enroll')
  getEnrolledCourses(@CurrentUser() user: User) {
    return this.coursesService.getEnrolledCourses(user.id)
  }

  @ApiOperation({ summary: 'User - Get all featured courses' })
  @Get('/featured')
  getFeaturedCourses() {
    return this.coursesService.getFeaturedCourses()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'User - Get course details' })
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

    return this.coursesService.getCourseDetailsByUser(id, userId)
  }
}
