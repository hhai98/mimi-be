import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface IResponse<T> {
  statusCode: number
  message: string
  data: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: data?.statusCode || context.switchToHttp().getResponse().statusCode,
        message: data?.message || 'Success',
        data: data?.result || data,
      }))
    )
  }
}
