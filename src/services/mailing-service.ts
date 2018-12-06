import { Config, getConfig } from './../config';
import Mailer from "nodemailer";
import { readFileSync } from 'fs';

export type MailTemplateArgs = {
  subject?: any,
  text?: any;
  html?: any;
};

export interface MailTemplate {
  subject: string;
  text?: string;
  html?: string;
};

export enum MailTemplateName {
  ON_ORDER_CREATE = "onOrderCreate",
  SEND_ACTIVATION_CODE = "sendActivationCode",
  TEST = "test"
}

export class MailingService {

  private _config: Config = getConfig();
  private static _argumentRegex = /{{[a-zA-Z]+}}/gi;

  public async sendMail(options: Mailer.SendMailOptions): Promise<Mailer.SentMessageInfo> {

    let transporter = this._createMailTransporter();
    let info = await transporter.sendMail(options);
    return info;

  }

  public async sendTestMail(file: string): Promise<Mailer.SentMessageInfo> {
    
    let testTemplate = this.getMailTemplate(MailTemplateName.TEST, {
      text: {message: "Text"}, html: {message: "HTML"}
    });

    let info = await this.sendMail({
      ...testTemplate,
      from: this._config.mailingServiceOptions.defaultSender,
      to: "dogga.nidhal@gmail.com",
      attachments: [{
        filename: "Commande nº 95737156134.xlsx",
        content: readFileSync(file),
        path: file
      }]
    });
    
    return info;

  }

  public getMailTemplate(templateName: MailTemplateName, args: MailTemplateArgs = {}): MailTemplate {
    
    let templatesString = readFileSync("./resources/mail-templates.json").toString();
    let templates = JSON.parse(templatesString);
    let template: MailTemplate = templates[templateName];

    if (!template)
      throw new Error(`Can't find template with name '${templateName}'`);

    if (template.text)
      template.text = this._replaceArguments(template.text, args.text);

    if (template.html)
      template.html = this._replaceArguments(template.html, args.html);

    if (template.subject)
      template.subject = this._replaceArguments(template.subject, args.subject);

    return template;

  }

  private _createMailTransporter(): Mailer.Transporter {
    return Mailer.createTransport(this._config.mailingServiceConfig);
  }

  private _replaceArguments(templateString: string, args: any): string {

    let templateArgs = templateString.match(MailingService._argumentRegex);
    let resultString = templateString.slice();

    if (templateArgs != null) {
      for (let templateArg of templateArgs) {

        let argumentKey = templateArg.substring(2, templateArg.length - 2);
        let argumentValue = args[argumentKey];

        resultString = resultString.replace(templateArg, argumentValue);

      }
    }

    return resultString;

  }

}