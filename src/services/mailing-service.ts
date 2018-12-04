import { Config, getConfig } from './../config/index';
import Mailer from "nodemailer";
import { readFileSync } from 'fs';

export class MailingService {

  private _config: Config = getConfig();

  public async sendTestMail(file: string): Promise<Mailer.SentMessageInfo> {
    
    let transporter = this.createMailTransporter();
    let info = await transporter.sendMail({
      from: 'Nidhal DOGGA <dogga.nidhal@icloud.com>',
      to: 'dogga.nidhal@gmail.com',
      subject: 'Test Mail',
      text: 'This is a test mail',
      html: '<b>This is a test mail</b>',
      attachments: [{
        filename: file,
        content: readFileSync(file)
      }]
    });
    return info;

  }

  private createMailTransporter(): Mailer.Transporter {
    return Mailer.createTransport(this._config.mailingService);
  }

}