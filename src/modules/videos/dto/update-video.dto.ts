import { PartialType } from '@nestjs/swagger'
import { CreateVideoDto } from 'src/modules/videos/dto/create-video.dto'

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}
