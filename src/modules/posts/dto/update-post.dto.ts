import { PartialType } from '@nestjs/swagger'
import { CreatePostDto } from 'src/modules/posts/dto/create-post.dto'

export class UpdatePostDto extends PartialType(CreatePostDto) {}
