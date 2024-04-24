import { Body, Controller, Get, Post, UseGuards, SerializeOptions, Patch } from '@nestjs/common'
import { AuthService } from 'modules/auth/auth.service'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthEmailLoginDto } from 'modules/auth/dto/auth-email-login.dto'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/modules/roles/roles.guard'
import { ROLE_ENUM } from 'src/modules/roles/roles.enum'
import { Roles } from 'src/modules/roles/roles.decorator'
import { AuthIsExistEmailDto } from 'src/modules/auth/dto/auth-email.dto'
import { AuthResetPasswordDto } from 'src/modules/auth/dto/auth-reset-password.dto'
import { AuthUpdatePasswordDto } from 'src/modules/auth/dto/auth-update-password.dto'
import { AuthAdminUpdateUserDto } from 'src/modules/auth/dto/auth-admin-update-user.dto'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { User } from 'src/modules/users/entities/user.entity'

@ApiTags('Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(public service: AuthService) {}

  @ApiOperation({ summary: 'Admin - Login' })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post('email/login')
  public adminLogin(@Body() loginDtO: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDtO, true)
  }

  @ApiOperation({ summary: 'Admin - Get information' })
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('me')
  @Roles(ROLE_ENUM.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public adminGetMe(@CurrentUser() user: User) {
    return this.service.me(user)
  }

  @ApiOperation({ summary: 'Admin - Send forgot password email' })
  @Post('email/send-forgot-password')
  forgotPassword(@Body() forgotPasswordDto: AuthIsExistEmailDto) {
    return this.service.forgotPassword(forgotPasswordDto.email)
  }

  @ApiOperation({ summary: 'Admin - Edit information' })
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @Roles(ROLE_ENUM.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public update(@CurrentUser() user: User, @Body() userDto: AuthAdminUpdateUserDto) {
    return this.service.updateByAdmin(user, userDto)
  }

  @ApiOperation({ summary: 'Admin - Send reset password' })
  @Post('email/reset-password')
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
    return this.service.resetPassword(resetPasswordDto)
  }

  @ApiOperation({ summary: 'Admin - Update password' })
  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me/update-password')
  @Roles(ROLE_ENUM.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  public updatePassword(@CurrentUser() user: User, @Body() passwordDto: AuthUpdatePasswordDto) {
    return this.service.updatePassword(user, passwordDto)
  }
}
