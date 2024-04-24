import { PartialType } from '@nestjs/swagger'
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto'

export class UpdateImageDto extends PartialType(CreateImageDto) {}
