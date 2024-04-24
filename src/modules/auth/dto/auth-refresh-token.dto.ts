import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export class AuthRefreshToken {
  @ApiProperty({ example: 'string' })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
