import { Module } from '@nestjs/common'
import { CodesService } from 'modules/codes/codes.service'
import { AdminCodesController } from 'modules/codes/admin.codes.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Code } from 'modules/codes/entities/code.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Code])],
  controllers: [AdminCodesController],
  providers: [CodesService],
  exports: [CodesService],
})
export class CodesModule {}
