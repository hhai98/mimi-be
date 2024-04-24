import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { TYPES_ENUM } from 'src/modules/questions/enums/types.enum'
import { CoreQueryDto } from 'src/utils/core/core-query.dto'

export class QuestionQueryDto extends CoreQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(TYPES_ENUM)
  type: TYPES_ENUM
}
