import { Member } from '../model/entity/users/member';
import { Config, getConfig } from './../../config';
import { MailingService, MailTemplateName } from './../../services/mailing-service';


export class MemberMailSender {

  private _config: Config = getConfig();
  private _mailingService: MailingService = new MailingService;

  public async sendActivationCode(member: Member, activationCode: string): Promise<void> {

    let sendActivationCodeTemplate = this._mailingService.getMailTemplate(MailTemplateName.SEND_ACTIVATION_CODE, {
      html: {
        memberName: `${member.person.firstName} ${member.person.lastName}`,
        activationCode: activationCode
      }
    });

    await this._mailingService.sendMail({
      ...sendActivationCodeTemplate,
      from: this._config.mailingServiceOptions.defaultSender,
      to: member.person.email
    });

  }

}