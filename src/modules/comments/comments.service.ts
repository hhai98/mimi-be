import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateCommentDto } from 'src/modules/comments/dto/create-comment.dto'
import { UpdateCommentDto } from 'src/modules/comments/dto/update-comment.dto'
import { Comment } from 'src/modules/comments/entities/comment.entity'
import { Video } from 'src/modules/videos/entities/video.entity'
import { FindManyOptions, IsNull, Repository } from 'typeorm'

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>
  ) {}

  async createByUser(createCommentDto: CreateCommentDto, userId: string) {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      authorId: userId,
    })

    const videoId = createCommentDto.videoId
    const video = await this.videosRepository.findOneBy({ id: videoId })
    if (!video) throw new NotFoundException(`Video with id ${videoId} not found`)

    const parentId = createCommentDto.parentId
    if (parentId) {
      const parent = await this.commentsRepository.findOneBy({ id: parentId })
      if (!parent) throw new NotFoundException(`Parent comment with id ${parentId} not found`)
      if (parent.parentId)
        throw new BadRequestException('Not allow to attach to comment already had parent')
    }
    return await this.commentsRepository.save(comment)
  }

  async updateByUser(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string
  ): Promise<Comment> {
    const comment = await this.findOne(id)

    if (comment.authorId !== userId) {
      throw new UnauthorizedException('You are not authorized to update this comment')
    }

    Object.assign(comment, updateCommentDto)

    return this.commentsRepository.save(comment)
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: { children: true },
    })
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }
    return comment
  }

  async findAll(): Promise<Comment[]> {
    const comments = await this.commentsRepository.find({
      where: { parentId: IsNull() },
      relations: { children: true },
    })
    return comments
  }

  async findFromVideo(videoId: string) {
    const options: FindManyOptions = {
      where: { parentId: IsNull(), videoId },
      relations: ['children'],
      order: {
        children: { createdAt: 'ASC' },
      },
    }

    const comments = await this.commentsRepository.find(options)
    return comments
  }

  async deleteByUser(id: string, userId: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: { children: true },
    })

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    if (comment.authorId !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this comment')
    }

    return await this.commentsRepository.remove(comment)
  }

  async deleteByAdmin(id: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: { children: true },
    })

    // remove its children
    const children = await this.commentsRepository.find({ where: { parentId: id } })
    if (children.length > 0) {
      await this.commentsRepository.remove(children)
    }

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    return await this.commentsRepository.remove(comment)
  }
}
