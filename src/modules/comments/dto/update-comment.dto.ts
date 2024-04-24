import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UpdateCommentDto {
  @ApiProperty({ example: 'Comment content' })
  @IsNotEmpty()
  content: string
}
