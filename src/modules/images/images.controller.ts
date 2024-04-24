import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ImagesService } from 'src/modules/images/images.service'

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({ summary: 'User - Get all images' })
  @Get()
  findAll() {
    return this.imagesService.findManyByUser()
  }
}
