import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator'

export class CreateCourseDto {
  @ApiProperty()
  @IsString({ message: 'Vui lòng nhập tiêu đề' })
  @IsNotEmpty({ message: 'Vui lòng nhập tiêu đề' })
  title: string

  @ApiProperty()
  @IsString({ message: 'Vui lòng chọn lại hình nền' })
  @IsNotEmpty({ message: 'Vui lòng chọn lại hình nền' })
  background: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Vui lòng chọn giáo viên' })
  teacherId: string

  @ApiProperty({
    description: 'Tóm tắt nội dung khóa học',
  })
  @IsString({ message: 'Vui lòng nhập tóm tắt nội dung khóa học' })
  @IsNotEmpty({ message: 'Vui lòng nhập tóm tắt nội dung khóa học' })
  summary: string

  @ApiProperty({
    description: 'Những lợi ích khi tham gia khóa học',
  })
  @IsString({ message: 'Vui lòng nhập lợi ích khi tham gia khóa học' })
  @IsNotEmpty({ message: 'Vui lòng nhập lợi ích khi tham gia khóa học' })
  benefits: string

  @ApiProperty()
  @IsBoolean({ message: 'Vui lòng chọn trạng thái xuất bản' })
  @IsNotEmpty({ message: 'Vui lòng chọn trạng thái xuất bản' })
  isPublished: boolean

  @ApiProperty({
    description: 'Cho hiện nổi bật, hiện lên trang chủ',
  })
  @IsBoolean({ message: 'Vui lòng chọn trạng thái nổi bật' })
  @IsNotEmpty({ message: 'Vui lòng chọn trạng thái nổi bật' })
  isFeatured: boolean

  @ApiProperty()
  @IsNumber({}, { message: 'Vui lòng nhập giá khóa học' })
  @IsNotEmpty({ message: 'Vui lòng nhập giá khóa học' })
  price: number

  @ApiProperty()
  @IsBoolean({ message: 'Vui lòng chọn trạng thái' })
  @IsNotEmpty({ message: 'Vui lòng chọn trạng thái' })
  isFree: boolean

  // @ApiProperty({
  //   description: 'Thời hạn học trong bao nhiêu tháng: 6, 12, nếu 0: không có thời hạn ',
  // })
  // @IsNumber({}, { message: 'Vui lòng nhập thời hạn học' })
  // studyTerm: number
}
