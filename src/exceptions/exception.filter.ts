import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common'

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const message = exception.message || 'Failure'
    const errors = exception?.getResponse?.().errors || exception?.getResponse?.().error || ''
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    console.error('exception: ', exception)
    console.error('message: ', message)
    console.error('errors: ', errors)
    response.status(statusCode).json({
      statusCode,
      message,
      errors,
    })
  }
}
