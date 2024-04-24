import { Module } from '@nestjs/common'
import { ImagesService } from 'modules/images/images.service'
import { ImagesController } from 'modules/images/images.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Image } from 'modules/images/entities/image.entity'
import { AdminImagesController } from 'modules/images/admin.images.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImagesController, AdminImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
