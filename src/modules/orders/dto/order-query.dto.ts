import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { STATUS_ENUM } from 'modules/orders/enums/statuses.enum'
import { CoreQueryDto } from 'src/utils/core/core-query.dto'

export class OrderQueryDto extends CoreQueryDto {
  @ApiProperty({ required: false, enum: STATUS_ENUM })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(STATUS_ENUM)
  status: STATUS_ENUM
}
