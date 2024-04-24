import { Transform } from 'class-transformer'

export function TransformBoolean() {
  return Transform(({ value }) => value === 'true')
}
