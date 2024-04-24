import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

export function SwaggerAuth() {
  return applyDecorators(ApiBearerAuth())
}

export function SwaggerMessage(message = '') {
  return applyDecorators(
    ApiOperation({
      summary: message,
    })
  )
}
