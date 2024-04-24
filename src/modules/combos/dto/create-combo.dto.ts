import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator'

export class CreateComboDto {
  @ApiProperty({ example: 'Combo title' })
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 'Combo background image' })
  @IsOptional()
  background: string

  @ApiProperty({ example: ['courseId 1', 'courseId 2', 'courseId 3'] })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  courseIds: string[]

  @ApiProperty({ example: 20 })
  @IsNumber()
  @IsOptional()
  discount: number

  @ApiProperty()
  @IsBoolean({ message: 'Vui lòng chọn trạng thái xuất bản' })
  @IsNotEmpty({ message: 'Vui lòng chọn trạng thái xuất bản' })
  isPublished: boolean
}
