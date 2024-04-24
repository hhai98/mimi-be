import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ])

    // If no specific roles are defined, allow access for all users.
    if (!roles || roles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    // If there is no user in the request, deny access.
    if (!request.user) {
      return false
    }

    // check roles
    return roles.includes(request.user.role)
  }
}
