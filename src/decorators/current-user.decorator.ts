import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { User } from 'src/modules/users/entities/user.entity'

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user as User | undefined
  return user
})
