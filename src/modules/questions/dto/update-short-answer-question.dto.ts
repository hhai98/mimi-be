import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateShortAnswerQuestionDto {
  @ApiProperty({
    example: 'What is the capital of Argentina: ${blank}. ${blank} indicates an input answer',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  question: string

  @ApiProperty({ example: ['Buenos Aires'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  correctAnswers: string[]

  @ApiProperty({ example: 'Answer explanation' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  answerExplain: string
}
