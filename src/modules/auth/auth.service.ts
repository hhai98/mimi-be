import { TOKEN_TYPE_ENUM } from 'modules/auth/enums/tokens.enum'
import { AuthUpdatePasswordDto } from 'modules/auth/dto/auth-update-password.dto'
import { CodesService } from 'modules/codes/codes.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'modules/users/entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { AuthEmailLoginDto } from 'modules/auth/dto/auth-email-login.dto'
import { ROLE_ENUM } from 'modules/roles/roles.enum'
import { AUTH_PROVIDER_ENUM } from 'modules/auth/auth-providers.enum'
import { AuthEmailRegisterDto } from 'src/modules/auth/dto/auth-email-register.dto'
import { UsersService } from 'modules/users/users.service'
import { MailService } from 'modules/mail/mail.service'
import { AuthResetPasswordDto } from 'modules/auth/dto/auth-reset-password.dto'
import { AuthRefreshToken } from 'src/modules/auth/dto/auth-refresh-token.dto'
import { ConfigService } from '@nestjs/config'
import { HttpNotFound, HttpUnprocessableEntity } from 'src/utils/throw-exception'
import { AuthUpdateDto } from 'src/modules/auth/dto/auth-update.dto'
import { AuthAdminUpdateUserDto } from 'src/modules/auth/dto/auth-admin-update-user.dto'

export interface IResponseAuth {
  accessToken: string
  refreshToken: string
  user: User
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
    private codesService: CodesService,
    private configService: ConfigService
  ) {}

  async encryptPassword(rawPassword: string) {
    const salt = await bcrypt.genSalt()
    const password = await bcrypt.hash(rawPassword, salt)
    return password
  }

  createTokens(user: User) {
    const accessToken = this.jwtService.sign({
      id: user.id,
      role: user.role,
      type: TOKEN_TYPE_ENUM.ACCESS_TOKEN,
    })
    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
        role: user.role,
        type: TOKEN_TYPE_ENUM.REFRESH_TOKEN,
      },
      { expiresIn: this.configService.get('auth.expiresRefreshToken') }
    )

    return { accessToken, refreshToken }
  }

  async checkEmailExists(email: string) {
    const user = await this.usersService.findOneWithDeleted({
      email,
    })
    return { isExists: Boolean(user) }
  }

  async sendCodeRecoverAccount(email: string) {
    const { isExists } = await this.checkEmailExists(email)

    if (!isExists) HttpNotFound()

    const code = await this.codesService.createCodeRecoverAccount(email)

    this.mailService.recoverAccount({
      to: email,
      data: {
        code: code.value,
      },
    })
  }

  async sendCodeVerifyEmail(email: string) {
    const code = await this.codesService.createCodeVerifyEmail(email)

    this.mailService.verifyEmail({
      to: email,
      data: {
        code: code.value,
      },
    })
  }

  async register(dto: AuthEmailRegisterDto): Promise<IResponseAuth> {
    // const code = await this.codesService.confirmCodeVerifyEmail(dto)

    // if (!code) HttpNotFound('Code is invalid or expired.')

    // Encrypt password
    const password = await this.encryptPassword(dto.password)
    const user = await this.usersService.createWithEmail({ ...dto, password })

    const tokens = await this.createTokens(user)
    return { ...tokens, user }
  }

  async forgotPassword(email: string): Promise<void> {
    const code = await this.codesService.createCodeResetPassword(email)

    this.mailService.forgotPassword({
      to: email,
      data: {
        code: code.value,
      },
    })
  }

  async resetPassword(dto: AuthResetPasswordDto): Promise<void> {
    const code = await this.codesService.confirmCodeResetPassword(dto)

    if (!code) HttpNotFound('Mã code không đúng hoặc đã hết hạn.')

    const user = await this.usersService.findOne({
      email: dto.email,
    })

    const salt = await bcrypt.genSalt()
    const password = await bcrypt.hash(dto.newPassword, salt)
    this.usersService.update(user.id, { password })
  }

  async validateLogin(
    loginDto: AuthEmailLoginDto,
    onlyAdmin: boolean,
    ip?: string
  ): Promise<IResponseAuth> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
    })

    // incorrect email
    if (!user || (user && !(onlyAdmin ? [ROLE_ENUM.ADMIN] : [ROLE_ENUM.USER]).includes(user.role)))
      HttpUnprocessableEntity('Email hoặc mật khẩu không chính xác.')

    if (user.provider !== AUTH_PROVIDER_ENUM.EMAIL)
      HttpUnprocessableEntity(`need login via provider :${user.provider}.`)

    const isValidPassword = await bcrypt.compare(loginDto.password, user.password)

    // incorrect password
    if (!isValidPassword) HttpUnprocessableEntity('Email hoặc mật khẩu không chính xác.')

    // check if user is blocked
    if (user.isBlocked)
      HttpUnprocessableEntity(
        'Tài khoản của bạn đang bị khóa. Vui lòng liên hệ admin để biết thêm thông tin.'
      )

    // get device limit from bank, if null then default 5
    const bankList = []
    const deviceLimit = bankList[0].deviceLimit

    // add ip to user, only 5 ip in array, check duplicate ip also, if over 5 ip, call function block user
    if (ip) {
      const ipList = user.ipList || []
      if (!ipList.includes(ip)) {
        ipList.push(ip)
        if (ipList.length > deviceLimit) {
          // block user
          this.usersService.update(user.id, { isBlocked: true })
          HttpUnprocessableEntity(
            'Do bạn đăng nhập quá số lượng thiết bị nên tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để biết thêm thông tin.'
          )
        } else {
          this.usersService.update(user.id, { ipList })
        }
      }
    }

    const tokens = await this.createTokens(user)

    return { ...tokens, user }
  }

  // Below methods to change user's info including avatar, name... and password
  me(user: User) {
    return { user }
  }

  updateByUser(user: User, userDto: AuthUpdateDto) {
    return this.usersService.updateByUser(user.id, userDto)
  }

  updateByAdmin(user: User, userDto: AuthAdminUpdateUserDto) {
    return this.usersService.updateByAdmin(user.id, userDto)
  }

  async updatePassword(user: User, passwordDto: AuthUpdatePasswordDto) {
    const isValidOldPassword = await bcrypt.compare(passwordDto.oldPassword, user.password)

    if (!isValidOldPassword) HttpUnprocessableEntity('Mật khẩu cũ không chính xác.')

    // Encrypt password
    const password = await this.encryptPassword(passwordDto.newPassword)
    await this.usersService.update(user.id, { password })
  }

  async refreshToken(refreshToken: AuthRefreshToken) {
    try {
      const payload = this.jwtService.verify(refreshToken.refreshToken)

      // It must be refresh token
      if (payload.type !== TOKEN_TYPE_ENUM.REFRESH_TOKEN)
        throw new UnauthorizedException('Lỗi refresh token')

      const user = await this.usersService.findOne({
        id: payload.id,
      })

      // Check if user exists or being removed
      if (!user) {
        throw new UnauthorizedException('Lỗi refresh token')
      }

      const tokens = this.createTokens(user)
      return tokens
    } catch (error) {
      throw new UnauthorizedException('Lỗi refresh token')
    }
  }

  async validateJwtToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token)

      // Check token: It must be accessToken
      if (payload.type !== TOKEN_TYPE_ENUM.ACCESS_TOKEN)
        throw new UnauthorizedException('Lỗi token')

      // We need to find user because when user was deleted, token will be expired.
      const currentUser = await this.usersService.findOne({
        id: payload.id,
      })

      if (!currentUser) throw new UnauthorizedException('Lỗi token')

      return currentUser
    } catch (error) {
      throw new UnauthorizedException('Lỗi token')
    }
  }
}
