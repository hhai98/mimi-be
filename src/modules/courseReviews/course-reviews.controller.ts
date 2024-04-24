import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { CreateCourseReviewDto } from 'modules/courseReviews/dto/create-course-review.dto'
import { UpdateCourseReviewDto } from 'src/modules/courseReviews/dto/update-course-review.dto'
import { CourseReviewsService } from 'src/modules/courseReviews/course-reviews.service'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { User } from 'src/modules/users/entities/user.entity'

@ApiTags('Course Reviews')
@Controller('course-reviews')
export class CourseReviewController {
  constructor(private readonly courseReviewsService: CourseReviewsService) {}

  @ApiOperation({ summary: 'User - Get a course review by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseReviewsService.findOne({ id })
  }

  @ApiOperation({ summary: 'User - Get all course reviews from course' })
  @Get('/course/:id')
  findAll(@Param('id') id: string) {
    return this.courseReviewsService.findFromCourse(id)
  }

  @ApiBearerAuth()
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'User - Create a new course review' })
  @Post()
  create(@Body() createCourseReviewDto: CreateCourseReviewDto, @CurrentUser() user: User) {
    const userId = user.id
    return this.courseReviewsService.createByUser(createCourseReviewDto, userId)
  }

  @ApiBearerAuth()
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'User - Update course review by id' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseReviewDto: UpdateCourseReviewDto,
    @CurrentUser() user: User
  ) {
    return this.courseReviewsService.updateByUser(id, updateCourseReviewDto, user.id)
  }

  @ApiBearerAuth()
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'User - Delete a course review by ID' })
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.courseReviewsService.deleteByUser(id, user.id)
  }
}
