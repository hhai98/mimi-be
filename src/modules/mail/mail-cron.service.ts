import { Injectable } from '@nestjs/common'
// import { Cron } from '@nestjs/schedule'
import { MailerService } from '@nestjs-modules/mailer'
import { exec } from 'child_process'
import { join } from 'path'

@Injectable()
export class MailCronService {
  constructor(private mailerService: MailerService) {}

  // @Cron('*/5 * * * * *')
  sendBackupDB() {
    exec('cron_send_backup_db.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Backup command execution error: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`Backup command stderr: ${stderr}`)
        return
      }

      // Send email with backup file attached
      this.mailSend()
    })
  }

  async mailSend() {
    try {
      await this.mailerService.sendMail({
        to: 'johnhoangnam123@gmail.com',
        subject: 'SAO LƯU CƠ SỞ DỮ LIỆU MIMI',
        html: '<h1>File Sao Lưu</h1>',
        attachments: [
          {
            path: join(__dirname, 'mail-templates', 'mimi_backup_database.dump'),
            filename: 'File_Sao_Lưu.dump',
            contentDisposition: 'attachment',
          },
        ],
      })

      return 'Success'
    } catch (error) {
      console.error('Error sending email:', error)
      return 'Failure'
    }
  }
}
