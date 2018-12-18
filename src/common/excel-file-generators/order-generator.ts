import { Order } from "../model/entity/order";
import { readFileSync } from "fs";
import { DateUtils } from "../utils";
let ExcelEngine = require("excel4node");

export interface ExcelFile {
  filename: string;
  content: string | Buffer;
  path: string;
}

export class OrderExcelFileGenerator {

  public async generateOrderCreationExcelFile(order: Order): Promise<ExcelFile> {

    return new Promise<ExcelFile>((resolve, reject) => {

      let workBook = new ExcelEngine.Workbook();
      let workSheet = workBook.addWorksheet(order.id.toString(), {sheetFormat: {sheetColWidth: 64}});
      
      workSheet.cell(1, 1).string("Numéro de commande");   
      workSheet.cell(1, 2).number(order.id);

      workSheet.cell(2, 1).string("Adresse de collecte");
      workSheet.cell(2, 2).string(order.pickupAddress.formattedAddress);

      workSheet.cell(3, 1).string("Adresse de livraison");
      workSheet.cell(3, 2).string(order.deliveryAddress.formattedAddress);

      workSheet.cell(4, 1).string("Créneau de collecte");
      workSheet.cell(4, 2)
        .string(`${order.pickupSlot.startDate.toISOString()} -> ${DateUtils.addMinutes(order.pickupSlot.startDate, order.pickupSlot.getDurationInMinutes()).toISOString()}`);

      workSheet.cell(5, 1).string("Créneau de livraison");
      workSheet.cell(5, 2)
        .string(`${order.deliverySlot.startDate.toISOString()} -> ${DateUtils.addMinutes(order.pickupSlot.startDate, order.deliverySlot.getDurationInMinutes()).toISOString()}`);

      workSheet.cell(6, 1).string("Nom et prénom du membre");
      workSheet.cell(6, 2).string(`${order.member.person.firstName} ${order.member.person.lastName}`);

      workSheet.cell(7, 1).string("Numéro de téléphoe du membre");
      workSheet.cell(7, 2).string(`${order.member.person.phone}`);
      
      let workBookPath = `/tmp/workbook-${new Date().getTime()}.xlsx`;

      workBook.write(workBookPath, (error: Error) => {
        
        if (error) {
          console.error(error);
          reject(error);
        }

        resolve({
          filename: `Réservation nº ${order.id}.xlsx`,
          content: readFileSync(workBookPath),
          path: workBookPath
        });
      });

    })

  }

}