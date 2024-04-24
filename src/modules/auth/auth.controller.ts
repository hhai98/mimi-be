import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Patch,
  SerializeOptions,
  Ip,
} from '@nestjs/common'
import { AuthService } from 'modules/auth/auth.service'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthEmailLoginDto } from 'modules/auth/dto/auth-email-login.dto'
import {
  AuthEmailDto,
  AuthIsNotExistEmailDto,
  AuthIsExistEmailDto,
} from 'modules/auth/dto/auth-email.dto'
import { AuthResetPasswordDto } from 'modules/auth/dto/auth-reset-password.dto'
import { AuthUpdatePasswordDto } from 'modules/auth/dto/auth-update-password.dto'
import { AuthUpdateDto } from 'modules/auth/dto/auth-update.dto'
import { AuthGuard } from '@nestjs/passport'
import { AuthEmailRegisterDto } from 'modules/auth/dto/auth-email-register.dto'
import { AuthRefreshToken } from 'src/modules/auth/dto/auth-refresh-token.dto'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { Roles } from 'src/modules/roles/roles.decorator'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { User } from 'src/modules/users/entities/user.entity'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(public service: AuthService) {}

  @ApiOperation({ summary: 'User - Check if email exists' })
  @Post('email/check-exists')
  @HttpCode(HttpStatus.OK)
  public checkEmailExists(@Body() emailDto: AuthEmailDto) {
    return this.service.checkEmailExists(emailDto.email)
  }

  @ApiOperation({ summary: 'User - Send verification code for email' })
  @Post('email/send-verify')
  public sendCodeVerifyEmail(@Body() emailDto: AuthIsNotExistEmailDto) {
    return this.service.sendCodeVerifyEmail(emailDto.email)
  }

  @ApiOperation({ summary: 'User - Register a new user by email' })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/register')
  register(@Body() createUserDto: AuthEmailRegisterDto) {
    return this.service.register(createUserDto)
  }

  @ApiOperation({ summary: 'User - Send forgot password email' })
  @Post('email/send-forgot-password')
  forgotPassword(@Body() forgotPasswordDto: AuthIsExistEmailDto) {
    return this.service.forgotPassword(forgotPasswordDto.email)
  }

  @ApiOperation({ summary: 'User - Send reset password' })
  @Post('email/reset-password')
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
    return this.service.resetPassword(resetPasswordDto)
  }

  @ApiOperation({ summary: 'User - Login' })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  public login(@Body() loginDto: AuthEmailLoginDto, @Ip() ip: string) {
    return this.service.validateLogin(loginDto, false, ip)
  }

  @ApiOperation({ summary: 'User - Get information' })
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public me(@CurrentUser() user: User) {
    return this.service.me(user)
  }

  @ApiOperation({ summary: 'User - Edit information' })
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public update(@CurrentUser() user: User, @Body() userDto: AuthUpdateDto) {
    return this.service.updateByUser(user, userDto)
  }

  @ApiOperation({ summary: 'User - Update password' })
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me/update-password')
  @Roles(ROLE_ENUM.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public updatePassword(@CurrentUser() user: User, @Body() passwordDto: AuthUpdatePasswordDto) {
    return this.service.updatePassword(user, passwordDto)
  }

  @ApiOperation({ summary: 'User - Refresh token' })
  @Post('refresh-token')
  public refreshToken(@Body() refreshToken: AuthRefreshToken) {
    return this.service.refreshToken(refreshToken)
  }
}
