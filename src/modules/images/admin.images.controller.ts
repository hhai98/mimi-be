import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { RolesGuard } from 'modules/roles/roles.guard'
import { ImagesService } from 'src/modules/images/images.service'
import { CreateImageDto } from 'src/modules/images/dto/create-image.dto'

@ApiBearerAuth()
@Roles(ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Images')
@Controller('admin/images')
export class AdminImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({ summary: 'Admin - Create a new image' })
  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.createImage(createImageDto)
  }

  @ApiOperation({ summary: 'Admin - Get list of images' })
  @Get()
  async findAll() {
    return await this.imagesService.findManyByAdmin()
  }

  @ApiOperation({ summary: 'Admin - Delete a image' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.imagesService.removeImage(id)
  }
}
