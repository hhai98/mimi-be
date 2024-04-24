import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class UpdateChoiceQuestionDto {
  @ApiProperty({ example: 'Question' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  question: string

  @ApiProperty({ example: ['Option 1', 'Option 2', 'Option 3'] })
  @IsArray()
  @ArrayMinSize(2, { message: 'You must provide at least two options.' })
  @ArrayMaxSize(6, { message: 'You can provide up to six options.' })
  @IsString({ each: true })
  @IsOptional()
  answers: string[]

  @ApiProperty({ example: [0, 2] })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  correctAnswers: number[]

  @ApiProperty({ example: 'Answer explanation' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  answerExplain: string
}
