import { Entity, EntityOptions } from 'typeorm'

export function CoreEntityMixin(options?: EntityOptions): ClassDecorator {
  return (target) => {
    Entity({ orderBy: { createdAt: 'ASC' }, ...(options || {}) })(target)
  }
}
