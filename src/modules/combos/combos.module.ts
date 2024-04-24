import { Module } from '@nestjs/common'
import { CombosService } from 'modules/combos/combos.service'
import { CombosController } from 'modules/combos/combos.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Combo } from 'modules/combos/entities/combo.entity'
import { AdminCombosController } from 'modules/combos/admin.combos.controller'
import { CoursesModule } from 'src/modules/courses/courses.module'
import { AuthModule } from 'src/modules/auth/auth.module'
import { EnrollmentModule } from 'src/modules/enrollments/enrollment.module'

@Module({
  imports: [TypeOrmModule.forFeature([Combo]), CoursesModule, AuthModule, EnrollmentModule],
  controllers: [CombosController, AdminCombosController],
  providers: [CombosService],
  exports: [CombosService],
})
export class CombosModule {}
