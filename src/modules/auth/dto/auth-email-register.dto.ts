import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength, Validate } from 'class-validator'
import { IsNotExist } from 'utils/validators/is-not-exists.validator'
import { Transform } from 'class-transformer'

export class AuthEmailRegisterDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @Validate(IsNotExist, ['User'], {
    message: 'Email đã tồn tại.',
  })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string

  @ApiProperty()
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự.' })
  password: string

  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: 'FirstName không được để trống.' })
  firstName: string

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: 'LastName không được để trống.' })
  lastName: string
}
