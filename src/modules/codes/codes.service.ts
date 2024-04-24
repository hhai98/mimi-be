import { NUMBER } from 'constants/index'
import { CoreService } from 'utils/core/core-service'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { Code } from 'modules/codes/entities/code.entity'
import { customAlphabet } from 'nanoid'
import { ConfigService } from '@nestjs/config'
import { CODE_TYPE_ENUM } from 'modules/codes/codes.enum'

interface IConfirmCode {
  email: string
  code: string
}

@Injectable()
export class CodesService extends CoreService<Code> {
  constructor(
    @InjectRepository(Code)
    private codesRepository: Repository<Code>,
    private configService: ConfigService
  ) {
    super(codesRepository)
  }

  initCode() {
    const nanoid = customAlphabet(NUMBER, 6)
    const value = nanoid()
    const numOfHoursToAdd = this.configService.get('auth.codeExpires')
    const expiresAt = new Date(Date.now() + numOfHoursToAdd * 60 * 60 * 1000)
    return { value, expiresAt }
  }

  createCodeResetPassword(email: string) {
    return this.create({
      ...this.initCode(),
      type: CODE_TYPE_ENUM.RESET_PASSWORD,
      email,
    })
  }

  createCodeVerifyEmail(email: string) {
    return this.create({
      ...this.initCode(),
      type: CODE_TYPE_ENUM.VERIFY_EMAIL,
      email,
    })
  }

  createCodeRecoverAccount(email: string) {
    return this.create({
      ...this.initCode(),
      type: CODE_TYPE_ENUM.RECOVER_ACCOUNT,
      email,
    })
  }

  async confirmCode(type: CODE_TYPE_ENUM, data: IConfirmCode) {
    const code = await this.codesRepository.findOne({
      where: {
        isUsed: false,
        value: data.code,
        email: data.email,
        type,
        expiresAt: MoreThanOrEqual(new Date()),
      },
    })

    if (!code) return false

    this.update(code.id, { isUsed: true })
    return true
  }

  confirmCodeVerifyEmail(data: IConfirmCode): Promise<boolean> {
    return this.confirmCode(CODE_TYPE_ENUM.VERIFY_EMAIL, data)
  }

  confirmCodeResetPassword(data: IConfirmCode): Promise<boolean> {
    return this.confirmCode(CODE_TYPE_ENUM.RESET_PASSWORD, data)
  }

  confirmCodeRecoverAccount(data: IConfirmCode): Promise<boolean> {
    return this.confirmCode(CODE_TYPE_ENUM.RECOVER_ACCOUNT, data)
  }
}
