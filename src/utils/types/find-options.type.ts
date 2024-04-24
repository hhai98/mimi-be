import { EntityCondition } from 'utils/types/entity-condition.type'

export type FindOptions<T> = {
  where: EntityCondition<T>[] | EntityCondition<T>
}
