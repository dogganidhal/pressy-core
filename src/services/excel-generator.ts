import { Stats } from "fs";
import {exec, execSync} from "child_process";

let ExcelEngine = require("excel4node");

export class ExcelGenerator {

  public async generateTestExcelFile(): Promise<string> {
    
    return new Promise<string>(resolve => {

      let workBook = new ExcelEngine.Workbook();
      let workSheet = workBook.addWorksheet('Test Sheet');

      // Create a reusable style
      var style = workBook.createStyle({
        font: {
          color: '#FF0800',
          size: 12,
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
      });
      
      // Set value of cell A1 to 100 as a number type styled with paramaters of style
      workSheet.cell(1, 1)
        .number(100)
        .style(style);
      
      // Set value of cell B1 to 200 as a number type styled with paramaters of style
      workSheet.cell(1, 2)
        .number(200)
        .style(style);
      
      // Set value of cell C1 to a formula styled with paramaters of style
      workSheet.cell(1, 3)
        .formula('A1 + B1')
        .style(style);
      
      // Set value of cell A2 to 'string' styled with paramaters of style
      workSheet.cell(2, 1)
        .string('string')
        .style(style);
      
      // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
      workSheet.cell(3, 1)
        .bool(true)
        .style(style)
        .style({font: {size: 14}});
      
      let workBookPath = `/tmp/workbook-${new Date().getTime()}.xlsx`;

      workBook.write(workBookPath, (error: Error, stats: Stats) => {
        
        if (error)
          console.error(error);

        resolve(workBookPath);
      });

    });

  }

}