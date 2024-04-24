import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CoreService } from 'src/utils/core/core-service'
import { ILike, Repository } from 'typeorm'
import { Post } from 'modules/posts/entities/post.entity'
import { CreatePostDto } from 'modules/posts/dto/create-post.dto'
import { PostQueryDto } from 'src/modules/posts/dto/post-query.dto'
import { infinityPagination } from 'src/utils/infinity-pagination'

@Injectable()
export class PostsService extends CoreService<Post> {
  constructor(@InjectRepository(Post) private postsRepository: Repository<Post>) {
    super(postsRepository)
  }

  async findManyByAdmin(query: PostQueryDto) {
    const { limit, page, search } = { ...query }
    const [data, count] = await this.repo.findAndCount({
      where: {
        title: ILike(`%${search}%`),
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: { author: true },
    })
    return infinityPagination({ data, count }, query)
  }

  async findManyByUser(query: PostQueryDto) {
    const { limit, page, search } = { ...query }
    const [data, count] = await this.repo.findAndCount({
      where: {
        title: ILike(`%${search}%`),
        isPublished: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: { author: true },
    })
    return infinityPagination({ data, count }, query)
  }

  async createPost(createPostDto: CreatePostDto, userId: string) {
    const post = this.postsRepository.create({
      ...createPostDto,
      authorId: userId,
    })
    return await this.postsRepository.save(post)
  }

  async removePost(id: string) {
    const post = await this.postsRepository.findOneBy({ id })
    if (!post) throw new NotFoundException(`post with id ${id} not found`)

    return this.postsRepository.remove(post)
  }

  async findFeaturedPosts() {
    return await this.postsRepository.find({ where: { isFeatured: true } })
  }

  async findSuggestionPosts() {
    const limit = 4
    // Get featured posts first, only get 4
    let suggestionPosts = await this.postsRepository.find({
      where: { isFeatured: true },
      take: limit,
    })

    // If not enough featured posts, get newest posts as suggestions
    if (suggestionPosts.length < limit) {
      const additionalPosts = await this.postsRepository.find({
        where: { isFeatured: false },
        order: { createdAt: 'DESC' },
        take: limit - suggestionPosts.length,
      })
      suggestionPosts = suggestionPosts.concat(additionalPosts)
    }

    return suggestionPosts
  }
}
