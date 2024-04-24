import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { CreateFeedbackDto } from 'modules/feedbacks/dto/create-feedback.dto'
import { FeedbacksService } from 'src/modules/feedbacks/feedbacks.service'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { User } from 'src/modules/users/entities/user.entity'

@ApiBearerAuth()
@Roles(ROLE_ENUM.USER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Feedbacks')
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @ApiOperation({ summary: 'User - Create a new feedback' })
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto, @CurrentUser() user: User) {
    const userId = user.id
    return this.feedbacksService.createByUser(createFeedbackDto, userId)
  }

  @ApiOperation({ summary: 'User - Get all featured feedbacks' })
  @Get('/featured')
  getFeaturedFeedbacks() {
    return this.feedbacksService.findFeaturedFeedbacks()
  }
}
