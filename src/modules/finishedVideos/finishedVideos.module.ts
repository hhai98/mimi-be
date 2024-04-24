import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FinishedVideo } from 'src/modules/finishedVideos/entities/finishedVideo.entity'
import { FinishedVideosService } from 'src/modules/finishedVideos/finishedVideos.service'

@Module({
  imports: [TypeOrmModule.forFeature([FinishedVideo])],
  providers: [FinishedVideosService],
  controllers: [],
  exports: [FinishedVideosService],
})
export class FinishedVideosModule {}
