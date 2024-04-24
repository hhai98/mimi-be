import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IMailData } from 'modules/mail/interfaces/mail-data.interface'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  async verifyEmail(mailData: IMailData<{ code: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Xác nhận Email',
      text: `${this.configService.get('app.frontendDomain')}/confirm-email/${
        mailData.data.code
      } Confirm email`,
      template: 'confirm-email',
      context: {
        title: 'Confirm email',
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/${mailData.data.code}`,
        actionTitle: 'Confirm email',
        // appName: this.configService.get('app.name'),
        appName: mailData.data.code,
        text1: 'Email từ Tiếng Trung Mimi',
        // text2: 'You’re almost ready to start enjoying',
        text2: 'Hãy sử dụng mã này để xác nhận email của bạn:',
        // text3: 'Simply click the big green button below to verify your email address.',
        text3: '',
      },
    })
  }

  async forgotPassword(mailData: IMailData<{ code: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Yêu cầu đặt lại mật khẩu',
      text: `${this.configService.get('app.frontendDomain')}/password-change/${
        mailData.data.code
      } Reset password`,
      template: 'reset-password',
      context: {
        title: 'Reset password',
        url: `${this.configService.get('app.frontendDomain')}/auth/reset-password?email=${
          mailData.to
        }&code=${mailData.data.code}`,
        actionTitle: 'Reset password',
        // appName: this.configService.get('app.name'),
        appName: mailData.data.code,
        text1: 'Email từ Tiếng Trung Mimi',
        text2: 'Hãy sử dụng mã này để đặt lại mật khẩu của bạn:',
        // text3:
        //   'Just press the button below and follow the instructions. We’ll have you up and running in no time.',
        // text3: 'Simply click the big button below to reset your password.',
        text3: '',
        text4: 'If you did not make this request then please ignore this email.',
      },
    })
  }

  async recoverAccount(mailData: IMailData<{ code: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Recover account',
      text: `${this.configService.get('app.frontendDomain')}/confirm-email/${
        mailData.data.code
      } Recover account`,
      template: 'recover-account',
      context: {
        title: 'Recover account',
        url: `${this.configService.get('app.frontendDomain')}/auth/recover-account?email=${
          mailData.to
        }&code=${mailData.data.code}`,
        actionTitle: 'Recover account',
        appName: this.configService.get('app.name'),
        // appName: mailData.data.code,
        text1: 'Hey!',
        // text2: 'You’re almost ready to start enjoying',
        text2: 'Using this code to recover account',
        // text3: 'Simply click the big green button below to verify your email address.',
        text3: 'Simply click the big button below to recover your account',
      },
    })
  }

  async activateCourses(mailData: IMailData<{ courses; user }>) {
    const courses = mailData.data.courses
    const user = mailData.data.user
    const frontendDomain = this.configService.get('app.frontendDomain')

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'TIẾNG TRUNG MIMI - XÁC NHẬN MUA KHÓA HỌC THÀNH CÔNG',
      template: 'thank-you-purchase',
      context: {
        user,
        courses,
        frontendDomain,
      },
    })
  }
}
