import { ApiProperty } from '@nestjs/swagger'
import { ArrayUnique, IsArray, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator'

export class CreateExamDto {
  @ApiProperty({ example: 'Exam title' })
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: ['questionId 1', 'questionId 2', 'questionId 3'] })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  questionIds: string[]

  @ApiProperty({ example: 50 })
  @IsNumber()
  @IsOptional()
  passPercentage: number

  @ApiProperty({ example: 'https://audio-url.com' })
  @IsOptional()
  audioUrl: string

  @ApiProperty({ example: 'Exam description' })
  @IsOptional()
  description: string
}
