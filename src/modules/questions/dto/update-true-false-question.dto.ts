import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateTrueFalseQuestionDto {
  @ApiProperty({
    example: 'Question',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  question: string

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  correctAnswer: boolean

  @ApiProperty({ example: 'Answer explanation' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  answerExplain: string
}
