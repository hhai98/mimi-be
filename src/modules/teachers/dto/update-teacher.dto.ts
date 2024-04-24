import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class UpdateTeacherDto {
  @ApiProperty({ example: 'Teacher bio' })
  @IsOptional()
  bio: string

  @ApiProperty({ example: 'Facebook URL' })
  @IsOptional()
  facebookURL: string
}
