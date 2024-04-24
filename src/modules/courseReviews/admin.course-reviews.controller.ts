import { Controller, Get, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CourseReviewsService } from 'src/modules/courseReviews/course-reviews.service'
import { CourseReviewQueryDto } from 'src/modules/courseReviews/dto/course-review-query.dto'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { infinityPagination } from 'src/utils/infinity-pagination'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Course Reviews')
@Controller('admin/course-reviews')
export class AdminCourseReviewController {
  constructor(private readonly courseReviewsService: CourseReviewsService) {}

  @ApiOperation({ summary: 'Admin - Get a course review by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseReviewsService.findOne({ id })
  }

  @ApiOperation({ summary: 'Admin - Get list course review' })
  @Get()
  async findAll(@Query() query: CourseReviewQueryDto) {
    return infinityPagination(await this.courseReviewsService.findAll(query), query)
  }

  @ApiOperation({ summary: 'Admin - Get all course reviews from course' })
  @Get('/course/:id')
  findFromCourse(@Param('id') id: string) {
    return this.courseReviewsService.findFromCourse(id)
  }

  @ApiOperation({ summary: 'Admin - Delete a course review by ID' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.courseReviewsService.deleteByAdmin(id)
  }
}
