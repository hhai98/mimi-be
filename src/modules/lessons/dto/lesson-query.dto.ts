import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { CoreQueryDto } from 'src/utils/core/core-query.dto'

export class AdminLessonQueryDto extends CoreQueryDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isPublished: boolean
}
