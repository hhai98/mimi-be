import { GENDER_ENUM } from 'modules/genders/genders.enum'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class AuthUpdateDto {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string

  @ApiProperty({ example: '0123456789' })
  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase().trim())
  phoneNumber?: string

  @ApiProperty()
  @IsOptional()
  avatar?: string | null

  @ApiProperty()
  @IsOptional()
  background?: string | null

  @ApiProperty({ type: Date })
  @IsOptional()
  dateOfBirth?: Date | null

  @ApiProperty({
    example: GENDER_ENUM.MALE,
    type: 'enum',
    enum: GENDER_ENUM,
  })
  @IsOptional()
  gender?: GENDER_ENUM | null

  @ApiProperty({ example: 'Hà Nội' })
  @IsOptional()
  district?: string | null
}
