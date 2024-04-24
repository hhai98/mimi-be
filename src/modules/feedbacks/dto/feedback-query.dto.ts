import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { CoreQueryDto } from 'src/utils/core/core-query.dto'

export class FeedbackQueryDto extends CoreQueryDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating: number
}
