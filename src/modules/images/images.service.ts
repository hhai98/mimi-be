import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { Repository } from 'typeorm'
import { Image } from 'modules/images/entities/image.entity'
import { CreateImageDto } from 'modules/images/dto/create-image.dto'
import { infinityPagination } from 'src/utils/infinity-pagination'

@Injectable()
export class ImagesService extends CoreService<Image> {
  constructor(@InjectRepository(Image) private imagesRepository: Repository<Image>) {
    super(imagesRepository)
  }

  async findManyByAdmin() {
    const [data, count] = await this.repo.findAndCount({ order: { order: 'ASC' } })
    return infinityPagination(
      { data, count },
      {
        page: 0,
        limit: 0,
      }
    )
  }

  async findManyByUser() {
    const [data, count] = await this.repo.findAndCount({ order: { order: 'ASC' } })
    return infinityPagination(
      { data, count },
      {
        page: 0,
        limit: 0,
      }
    )
  }

  async createImage(createImageDto: CreateImageDto) {
    const image = this.imagesRepository.create(createImageDto)
    return await this.imagesRepository.save(image)
  }

  async removeImage(id: string) {
    const image = await this.imagesRepository.findOneBy({ id })
    if (!image) throw new NotFoundException(`image with id ${id} not found`)

    return this.imagesRepository.remove(image)
  }
}
