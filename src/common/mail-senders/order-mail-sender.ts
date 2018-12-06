import { Config, getConfig } from './../../config/index';
import { AdminRepository } from './../repositories/users/admin-repository';
import { Order } from "../../common/model/entity/order";
import { MailingService, MailTemplateName } from "../../services/mailing-service";
import { Database } from '../../common/db';
import { OrderExcelFileGenerator } from '../../common/excel-file-generators/order-generator';


export class OrderMailSender {

  private _config: Config = getConfig();
  private _mailingService: MailingService = new MailingService;
  private _adminRepository: AdminRepository = new AdminRepository(Database.getConnection());

  public async sendOrderConfirmationMail(order: Order): Promise<void> {
    // TODO: Implement Order Confimation Email
  }

  public async sendOrderInformationMailToAdmins(order: Order): Promise<void> {

    let excelGenerator = new OrderExcelFileGenerator;
    let admins = await this._adminRepository.getAllAdmins();
    let onOrderCreateMailTemplate = this._mailingService.getMailTemplate(MailTemplateName.ON_ORDER_CREATE, {
      text: {
        orderId: order.id,
        memberName: `${order.member.person.firstName} ${order.member.person.lastName}`
      },
      subject: {
        orderId: order.id
      },
    });
    let adminEmails = admins.map(admin => `"${admin.person.email}"`);
    let orderExcelFile = await excelGenerator.generateOrderCreationExcelFile(order);

    await this._mailingService.sendMail({
      ...onOrderCreateMailTemplate,
      from: this._config.mailingServiceOptions.defaultSender,
      to: adminEmails.join(","),
      attachments: [orderExcelFile]
    });

  }

}