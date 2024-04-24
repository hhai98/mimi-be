import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateTeacherDto {
  @ApiProperty({ example: 'User ID' })
  @IsNotEmpty()
  userId: string

  @ApiProperty({ example: 'Teacher bio' })
  @IsOptional()
  bio: string

  @ApiProperty({ example: 'Facebook URL' })
  @IsOptional()
  facebookURL: string
}
