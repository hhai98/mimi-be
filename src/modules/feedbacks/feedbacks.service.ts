import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { ILike, IsNull, Repository } from 'typeorm'
import { Feedback } from 'modules/feedbacks/entities/feedback.entity'
import { CreateFeedbackDto } from 'modules/feedbacks/dto/create-feedback.dto'
import { FeedbackQueryDto } from 'src/modules/feedbacks/dto/feedback-query.dto'
import { infinityPagination } from 'src/utils/infinity-pagination'

@Injectable()
export class FeedbacksService extends CoreService<Feedback> {
  constructor(@InjectRepository(Feedback) private feedbacksRepository: Repository<Feedback>) {
    super(feedbacksRepository)
  }

  async findManyByAdmin(query: FeedbackQueryDto) {
    const { limit, page, search } = { ...query }
    const [data, count] = await this.repo.findAndCount({
      where: [{ title: ILike(`%${search}%`) }, { title: IsNull() }],
      skip: (page - 1) * limit,
      take: limit,
      relations: { author: true },
    })
    return infinityPagination({ data, count }, query)
  }

  async createByUser(createFeedbackDto: CreateFeedbackDto, userId: string) {
    const feedback = this.feedbacksRepository.create({
      ...createFeedbackDto,
      authorId: userId,
    })
    return await this.feedbacksRepository.save(feedback)
  }

  async removeFeedback(id: string) {
    const feedback = await this.feedbacksRepository.findOneBy({ id })
    if (!feedback) throw new NotFoundException(`feedback with id ${id} not found`)

    return this.feedbacksRepository.remove(feedback)
  }

  async findFeaturedFeedbacks() {
    return await this.feedbacksRepository.find({ where: { isFeatured: true } })
  }
}
