import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ExamsService } from 'src/modules/exams/exams.service'

@ApiTags('Exams')
@Controller('exams')
export class AnonymousExamsController {
  constructor(private readonly examsService: ExamsService) {}

  // Ranking
  @ApiOperation({ summary: 'User - Get ranking of attempts in a video' })
  @Get(':videoId/ranking')
  getAttemptRanking(@Param('videoId') videoId: string) {
    return this.examsService.getAttemptRankingInVideoId(videoId)
  }
}
