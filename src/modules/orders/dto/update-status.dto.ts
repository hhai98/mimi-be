import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsUUID } from 'class-validator'

export class ConfirmOrderDto {
  @ApiProperty()
  @IsUUID()
  orderId: string

  @ApiProperty({
    description:
      'True to accept the order and send activation code to user email. False to cancel the order',
  })
  @IsBoolean()
  confirm: boolean
}
