import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator'

export class CreateFeedbackDto {
  @ApiProperty({ example: 'This is title' })
  @IsOptional()
  title: string

  @ApiProperty({ example: 'This is content' })
  @IsNotEmpty()
  content: string

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(5)
  @IsInt()
  rating: number
}
