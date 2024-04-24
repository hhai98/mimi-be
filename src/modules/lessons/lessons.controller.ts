import { Controller, Get, Headers, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from 'src/modules/auth/auth.service'
import { LessonsService } from 'src/modules/lessons/lessons.service'
// import { infinityPagination } from 'src/utils/infinity-pagination'

@ApiBearerAuth()
@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ summary: 'User - Get lesson details' })
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
    return this.lessonsService.getLessonDetailsByUser(id, userId)
  }
}
