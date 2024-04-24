import { ApiProperty } from '@nestjs/swagger'
import { MinLength } from 'class-validator'

export class AuthUpdatePasswordDto {
  @ApiProperty()
  @MinLength(6, { message: 'Mật khẩu cũ phải có ít nhất 6 ký tự.' })
  oldPassword: string

  @ApiProperty()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
  newPassword: string
}
