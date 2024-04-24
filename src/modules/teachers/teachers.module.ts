import { Module } from '@nestjs/common'
import { TeachersService } from 'src/modules/teachers/teachers.service'
import { TeacherController } from 'src/modules/teachers/teachers.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Teacher } from 'src/modules/teachers/entities/teacher.entity'
import { AdminTeacherController } from 'src/modules/teachers/admin.teacher.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Teacher])],
  controllers: [TeacherController, AdminTeacherController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
