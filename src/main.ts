import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { useContainer } from 'class-validator'
import { AppModule } from 'modules/app/app.module'
import validationOptions from 'utils/validation-options'

import setupSwagger from 'src/setupSwagger'
import * as compression from 'compression'
import helmet from 'helmet'
import { ResponseInterceptor } from 'src/interceptors/response.interceptor'
// import { TimeoutInterceptor } from 'src/interceptors/timeout.interceptor'
import { BaseExceptionFilter } from 'exceptions/exception.filter'
// import { RedisIoAdapter } from 'src/modules/sockets/adapters/redis-io.adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  const configService = app.get(ConfigService)

  app.enableShutdownHooks()

  // Swagger
  setupSwagger(app)

  // Helmet
  app.use(helmet())

  // Compression
  app.use(compression())

  // Cors
  // app.enableCors({
  //   origin: [configService.get('app.frontendDomain')],
  //   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'PUT', 'OPTIONS'],
  //   credentials: true,
  // })
  app.enableCors()

  // Validation
  app.useGlobalPipes(new ValidationPipe(validationOptions))

  // Exception => Define the common error response
  // In development, it should show error
  // if (configService.get('app.nodeEnv') === 'production')
  app.useGlobalFilters(new BaseExceptionFilter())

  // Interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  // Interceptor => Define the common success response
  app.useGlobalInterceptors(new ResponseInterceptor())

  // Interceptor => Response error if request timeout
  // app.useGlobalInterceptors(new TimeoutInterceptor(configService))

  await app.listen(configService.get('app.port'))
}

void bootstrap()
