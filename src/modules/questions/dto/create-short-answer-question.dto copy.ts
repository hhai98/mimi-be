import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateShortAnswerQuestionDto {
  @ApiProperty({
    example: 'What is the capital of Argentina: ${blank}. ${blank} indicates an input answer',
  })
  @IsNotEmpty()
  @IsString()
  question: string

  @ApiProperty({ example: ['Buenos Aires'] })
  @IsArray()
  @IsString({ each: true })
  correctAnswers: string[]

  @ApiProperty({ example: 'Answer explanation' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  answerExplain: string
}
