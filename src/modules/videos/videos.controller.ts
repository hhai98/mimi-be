import { Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { AuthService } from 'src/modules/auth/auth.service'
import { Roles } from 'src/modules/roles/roles.decorator'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { User } from 'src/modules/users/entities/user.entity'
import { VideosService } from 'src/modules/videos/videos.service'

@ApiBearerAuth()
@ApiTags('Videos')
@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ summary: 'User - Get video details' })
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
    return this.videosService.getVideoDetails(id, userId)
  }

  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'User - Toggle video finished' })
  @Post('toggle-finished/:videoId')
  toggleFinished(@Param('videoId') id: string, @CurrentUser() user: User) {
    return this.videosService.toggleFinished(id, user.id)
  }
}
