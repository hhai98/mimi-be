import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator'

export class UpdateCourseReviewDto {
  @ApiProperty({ example: 'This is content' })
  @IsNotEmpty()
  @IsOptional()
  content: string

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @Min(0)
  @Max(5)
  @IsInt()
  @IsOptional()
  rating: number
}
