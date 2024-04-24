import { PartialType } from '@nestjs/swagger'
import { CreateLessonDto } from 'src/modules/lessons/dto/create-lesson.dto'

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
