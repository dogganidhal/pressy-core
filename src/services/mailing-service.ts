import { Config, getConfig } from './../config/index';
import Mailer from "nodemailer";

export class MailingService {

  private _config: Config = getConfig();

  public async sendTestMail(): Promise<Mailer.SentMessageInfo> {
    
    let transporter = this.createMailTransporter();
    let info = await transporter.sendMail({
      from: 'Nidhal DOGGA <dogga.nidhal@icloud.com>',
      to: 'mohamed.benabdallah.et@gmail.com',
      subject: 'Test Mail',
      text: 'This is a test mail',
      html: '<b>This is a test mail</b>',
    });
    return info;

  }

  private createMailTransporter(): Mailer.Transporter {
    return Mailer.createTransport(this._config.mailingService);
  }

}