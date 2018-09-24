
export class DateUtils {
  
  public static addYears(years: number): Date {
    const newDate: Date = new Date();
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
  }
  
  public static addMonths(months: number): Date {
    const newDate: Date = new Date();
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }
  
  public static addDays(days: number): Date {
    const newDate: Date = new Date();
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }
  
  public static addHours(hours: number): Date {
    const newDate: Date = new Date();
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  }
  
  public static addMinutes(minutes: number): Date {
    const newDate: Date = new Date();
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
  }
  
  public static addSeconds(seconds: number): Date {
    const newDate: Date = new Date();
    newDate.setSeconds(newDate.getSeconds() + seconds);
    return newDate;
  }

  public static now(): Date {
    return new Date();
  }

  public static checkCreditCardExpiryDate(date: string) {
    const [month, year] = date.split("/");
      if (year == undefined || month == undefined)
        throw new Error("Invalid credit card expiry date");
      if (parseInt(month) > 12)
        throw new Error(`Invalid month ${month}`);

      
      const expiryDate = new Date((parseInt(year) % 100) + 2000, parseInt(month) - 1);
      const nowDate = new Date(DateUtils.now().getFullYear(), DateUtils.now().getMonth());

      if (expiryDate <= nowDate)
        throw new Error("Expired credit card");
  }

}