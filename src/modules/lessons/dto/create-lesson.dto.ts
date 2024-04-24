import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsBoolean, IsString, IsUUID } from 'class-validator'

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ default: true })
  @IsBoolean()
  isPublished: boolean

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  courseId: string
}
