import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength, Validate } from 'class-validator'
import { IsNotExist } from 'utils/validators/is-not-exists.validator'

export class CreateUserWithEmailDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'email already exists',
  })
  email: string

  @ApiProperty()
  @MinLength(6)
  password: string

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string
}
