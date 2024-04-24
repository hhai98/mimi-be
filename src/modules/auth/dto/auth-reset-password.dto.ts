import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength, Validate } from 'class-validator'
import { IsExist } from 'utils/validators/is-exists.validator'

export class AuthResetPasswordDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @Validate(IsExist, ['User'], {
    message: 'Email không tồn tại.',
  })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string

  @ApiProperty()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
  newPassword: string

  @ApiProperty()
  @MinLength(6, { message: 'Mã xác nhận phải có ít nhất 6 ký tự.' })
  code: string
}
