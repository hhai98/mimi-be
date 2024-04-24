import { PartialType } from '@nestjs/swagger'
import { CreateExamDto } from 'src/modules/exams/dto/create-exam.dto'

export class UpdateExamDto extends PartialType(CreateExamDto) {}
