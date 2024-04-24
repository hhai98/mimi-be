import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { EnrollmentQueryDto } from 'src/modules/enrollments/dto/enrollment-query.dto'
import { StatisticsService } from 'src/modules/statistics/statistics.service'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Statistics')
@Controller('admin/statistics')
export class AdminStatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @ApiOperation({ summary: 'Admin - Get list study progress' })
  @Get('study-progress')
  @HttpCode(HttpStatus.OK)
  async getStudyProgress(@Query() query: EnrollmentQueryDto) {
    return await this.statisticsService.getStudyProgress(query)
  }

  @ApiOperation({ summary: 'Admin - Get statistic dashboard' })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getSummary() {
    return await this.statisticsService.getSummary()
  }
}
