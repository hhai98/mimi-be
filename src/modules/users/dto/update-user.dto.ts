import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { STATUS_ENUM } from 'src/modules/users/enums/statuses.enum'
import { GENDER_ENUM } from 'modules/genders/genders.enum'
import { ApiProperty } from '@nestjs/swagger'

import { Transform } from 'class-transformer'
import { IsNumberString, IsOptional } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  email?: string | null

  @ApiProperty()
  @Transform(({ value }) => value?.trim() || null)
  @IsNumberString()
  @IsOptional()
  phoneNumber?: string | null

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string | null

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null

  @ApiProperty()
  @IsOptional()
  avatar?: string | null

  @ApiProperty()
  @IsOptional()
  background?: string | null

  @ApiProperty()
  @IsOptional()
  dateOfBirth?: Date | null

  @ApiProperty({ type: 'enum', enum: GENDER_ENUM })
  @IsOptional()
  gender?: GENDER_ENUM | null

  @ApiProperty()
  @IsOptional()
  district?: string | null

  @ApiProperty({ type: 'enum', enum: ROLE_ENUM })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  role?: ROLE_ENUM

  @ApiProperty({ type: 'enum', enum: STATUS_ENUM })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  status?: STATUS_ENUM
}
