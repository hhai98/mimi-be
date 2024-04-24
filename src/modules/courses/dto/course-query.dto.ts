import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator'
import { CoreQueryDto } from 'src/utils/core/core-query.dto'

export class AdminCourseQueryDto extends CoreQueryDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @IsOptional()
  price: number

  @ApiProperty({ required: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isPublished: boolean
}

export class UserCourseQueryDto extends CoreQueryDto {}
