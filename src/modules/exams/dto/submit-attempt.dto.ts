import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, IsNotEmpty } from 'class-validator'

export class SubmitAttemptDto {
  @ApiProperty({
    example: [
      { questionId: 'questionId1', userAnswer: ['shortAnswer1', 'shortAnswer2'] },
      { questionId: 'questionId2', userAnswer: true },
      { questionId: 'questionId3', userAnswer: ['choiceAnswer1'] },
      { questionId: 'questionId4', userAnswer: ['choiceAnswer1', 'choiceAnswer2'] },
    ],
  })
  @IsArray()
  userAnswers: UserAnswerDto[]
}

export class UserAnswerDto {
  @ApiProperty({ example: 'questionId' })
  @IsNotEmpty()
  @IsString()
  questionId: string // You may want to specify the type for the question ID

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userAnswer: string | string[] | boolean
}
