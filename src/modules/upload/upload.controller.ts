import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common'
import { Express } from 'express'
import { v2 } from 'cloudinary'
import toStream = require('buffer-to-stream')
import { ApiUploadFile } from 'modules/upload/upload.decorator'
import { RolesGuard } from 'modules/roles/roles.guard'
import { Roles } from 'modules/roles/roles.decorator'
import { ROLE_ENUM } from 'modules/roles/roles.enum'

// You call post api: /upload/file and property is file
@ApiBearerAuth()
@Roles(ROLE_ENUM.USER, ROLE_ENUM.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('upload')
@ApiTags('Upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  @ApiOperation({ summary: 'User - Upload file' })
  @Post('file')
  @ApiUploadFile()
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg|jpeg|png|svg|webp',
        })
        .addMaxSizeValidator({
          // 1000 = 1000B = 1 KB
          // 1000 * 1024 = 1KB * 1024 = 1024 KB = 1 MB
          // maxSize = 10 MB
          maxSize: 1000 * 1024 * 10,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File
  ) {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error)
        const {
          width,
          height,
          format,
          resource_type: resourceType,
          created_at: createdAt,
          bytes,
          type,
          secure_url: secureUrl,
          original_filename: originalFilename,
        } = result
        resolve({
          width,
          height,
          format,
          resourceType,
          createdAt,
          bytes,
          type,
          secureUrl,
          originalFilename,
        })
      })
      toStream(file.buffer).pipe(upload)
    })
  }
}
