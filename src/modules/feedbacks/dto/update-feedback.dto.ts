import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsBoolean } from 'class-validator'
import { STATUS_ENUM } from 'modules/feedbacks/enums/statuses.enum'

export class UpdateStatusDto {
  @ApiProperty({ enum: STATUS_ENUM })
  @IsNotEmpty()
  @IsEnum(STATUS_ENUM)
  status: STATUS_ENUM

  @ApiProperty({
    description: 'Cho hiện nổi bật, hiện lên trang chủ',
  })
  @IsBoolean({ message: 'Vui lòng chọn trạng thái nổi bật' })
  @IsNotEmpty({ message: 'Vui lòng chọn trạng thái nổi bật' })
  isFeatured?: boolean
}
