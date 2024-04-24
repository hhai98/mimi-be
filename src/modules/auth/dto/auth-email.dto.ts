import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Validate } from 'class-validator'
import { Transform } from 'class-transformer'
import { IsNotExist } from 'utils/validators/is-not-exists.validator'
import { IsExist } from 'utils/validators/is-exists.validator'

// for API check if email exists
export class AuthEmailDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string
}

export class AuthIsNotExistEmailDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @Validate(IsNotExist, ['User'], {
    message: 'Email đã tồn tại.',
  })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string
}

export class AuthIsExistEmailDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @Validate(IsExist, ['User'], {
    message: 'Email không tồn tại.',
  })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string
}
