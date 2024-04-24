import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsBoolean, IsString, IsUUID, IsUrl, IsOptional } from 'class-validator'

export class CreateVideoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty()
  @IsUrl()
  link: string

  @ApiProperty({ default: true })
  @IsBoolean()
  isPublished: boolean

  @ApiProperty({ default: false })
  @IsBoolean()
  isFree: boolean

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lessonId: string

  @ApiProperty()
  @IsOptional()
  examId: string
}
