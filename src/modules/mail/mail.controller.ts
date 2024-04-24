import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { MailCronService } from 'src/modules/mail/mail-cron.service'

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailCronService: MailCronService) {}

  @Get('send-backup-db')
  sendBackupDatabase() {
    return this.mailCronService.sendBackupDB()
  }
}
