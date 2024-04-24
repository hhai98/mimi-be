import {
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common'

export const HttpNotFound = (message = '') => {
  throw new NotFoundException(message || 'Không tìm thấy dữ liệu.')
}

export const HttpUnprocessableEntity = (message = '') => {
  throw new UnprocessableEntityException(message)
}

export const HttpBadRequest = (message = '') => {
  throw new BadRequestException(message)
}
