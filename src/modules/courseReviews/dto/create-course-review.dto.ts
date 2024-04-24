import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator'

export class CreateCourseReviewDto {
  @ApiProperty()
  @IsUUID()
  courseId: string

  @ApiProperty({ example: 'This is content' })
  @IsNotEmpty()
  content: string

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @Min(0)
  @Max(5)
  @IsInt()
  rating: number
}
