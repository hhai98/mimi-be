import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class AddCourseDto {
  @ApiProperty()
  @IsUUID()
  courseId: string
}
