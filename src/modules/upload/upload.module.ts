import { Module } from '@nestjs/common'
import { UploadController } from 'modules/upload/upload.controller'
import { UploadProvider } from 'modules/upload/upload.provider'

@Module({
  providers: [UploadProvider],
  controllers: [UploadController],
})
export class UploadModule {}
