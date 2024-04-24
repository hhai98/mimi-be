import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTrueFalseQuestionDto {
  @ApiProperty({
    example: 'Question',
  })
  @IsNotEmpty()
  @IsString()
  question: string

  @ApiProperty()
  @IsBoolean()
  correctAnswer: boolean

  @ApiProperty({ example: 'Answer explanation' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  answerExplain: string
}
