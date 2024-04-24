import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateCommentDto {
  @ApiProperty()
  @IsUUID()
  videoId: string

  @ApiProperty({ example: 'parent comment id' })
  @IsUUID()
  @IsOptional()
  parentId: string

  @ApiProperty({ example: 'Comment content' })
  @IsNotEmpty()
  @IsString()
  content: string
}
