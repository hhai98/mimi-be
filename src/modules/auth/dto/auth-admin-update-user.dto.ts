import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { AuthUpdateDto } from 'src/modules/auth/dto/auth-update.dto'

export class AuthAdminUpdateUserDto extends AuthUpdateDto {
  @ApiProperty({ example: 'abc' })
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string
}
