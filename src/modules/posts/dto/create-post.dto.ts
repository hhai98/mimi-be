import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreatePostDto {
  @ApiProperty({ example: 'This is content' })
  @IsNotEmpty()
  content: string

  @ApiProperty({ example: 'This is cover post' })
  @IsNotEmpty()
  cover: string

  @ApiProperty({ example: 'Post Title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255) // Assuming a maximum length for the title, adjust if needed
  title: string

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean

  @ApiProperty({
    description: 'Cho hiện nổi bật, hiện lên trang chủ',
  })
  @IsBoolean({ message: 'Vui lòng chọn trạng thái nổi bật' })
  @IsNotEmpty({ message: 'Vui lòng chọn trạng thái nổi bật' })
  isFeatured?: boolean
}
