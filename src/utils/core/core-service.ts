import { isUUID } from 'class-validator'
import { HttpNotFound, HttpUnprocessableEntity } from 'src/utils/throw-exception'
import { Repository, DeepPartial } from 'typeorm'
import { CoreEntity } from 'utils/core/core-entity'
import { EntityCondition } from 'utils/types/entity-condition.type'
import { IPaginationOptions } from 'utils/types/pagination-options'

export abstract class CoreService<T extends CoreEntity> {
  protected constructor(protected readonly repo: Repository<T>) {}

  async create(dto: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(dto)
    const [createdEntity] = await this.repo.save([entity])
    return createdEntity
  }

  async findManyWithPagination(
    paginationOptions: IPaginationOptions,
    withDeleted = false,
    where?: EntityCondition<T>
  ) {
    const { limit, page } = paginationOptions

    const [data, count] = await Promise.all([
      this.repo.find({
        skip: (page - 1) * limit,
        take: limit,
        withDeleted,
        where,
      }),
      this.getTotalCount(),
    ])
    return { data, count }
  }

  findManyWithPaginationWithDeleted(
    paginationOptions: IPaginationOptions,
    where?: EntityCondition<T>
  ) {
    return this.findManyWithPagination(paginationOptions, true, where)
  }

  async findOne(fields: EntityCondition<T>, withDeleted = false) {
    if (fields.id && !isUUID(fields.id)) HttpUnprocessableEntity('Invalid UUID format.')

    const entity = await this.repo.findOne({
      where: fields,
      withDeleted,
    })
    if (!entity) HttpNotFound()
    return entity
  }

  findOneWithDeleted(fields: EntityCondition<T>) {
    return this.findOne(fields, true)
  }

  async update(id: string, dto: DeepPartial<T>) {
    if (!isUUID(id)) HttpUnprocessableEntity('Invalid UUID format.')

    const updateData: DeepPartial<T> = { id, ...dto }
    const result = await this.repo.save(updateData)
    return result
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id)
  }

  async recoverEntity(fields: EntityCondition<T>) {
    const entity = await this.findOneWithDeleted(fields)
    if (!entity) HttpNotFound()
    return entity.save()
  }

  getTotalCount(): Promise<number> {
    return this.repo.count()
  }
}
