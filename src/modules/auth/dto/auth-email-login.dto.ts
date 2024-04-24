import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength, Validate } from 'class-validator'
import { IsExist } from 'src/utils/validators/is-exists.validator'
import { Transform } from 'class-transformer'

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @Validate(IsExist, ['User'], {
    message: 'Email không tồn tại.',
  })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string

  @ApiProperty()
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự.' })
  password: string
}
