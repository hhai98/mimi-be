import { PartialType } from '@nestjs/swagger'
import { CreateComboDto } from 'src/modules/combos/dto/create-combo.dto'

export class UpdateComboDto extends PartialType(CreateComboDto) {}
