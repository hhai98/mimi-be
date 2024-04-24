import { ApiProperty } from '@nestjs/swagger'
import { IsArray } from 'class-validator'

export class AddUserDto {
  @ApiProperty()
  @IsArray()
  userId: string[]
}
