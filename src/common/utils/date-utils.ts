export class DateUtils {
  public static dateByAddingTimeInterval(
    date: Date,
    timeinterval: number
  ): Date {
    const newDate = new Date();
    newDate.setTime(date.getTime() + timeinterval);
    return newDate;
  }

  public static dateBySubsctractingTimeInterval(
    date: Date,
    timeinterval: number
  ): Date {
    const newDate = new Date();
    newDate.setTime(date.getTime() - timeinterval);
    return newDate;
  }

  public static addYears(date: Date, years: number): Date {
    const newDate: Date = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
  }

  public static addMonths(date: Date, months: number): Date {
    const newDate: Date = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  public static addDays(date: Date, days: number): Date {
    const newDate: Date = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  public static addHours(date: Date, hours: number): Date {
    const newDate: Date = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  }

  public static addMinutes(date: Date, minutes: number): Date {
    const newDate: Date = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
  }

  public static addSeconds(date: Date, seconds: number): Date {
    const newDate: Date = new Date(date);
    newDate.setSeconds(newDate.getSeconds() + seconds);
    return newDate;
  }

  public static addYearsFromNow(years: number): Date {
    const newDate: Date = new Date();
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
  }

  public static addMonthsFromNow(months: number): Date {
    const newDate: Date = new Date();
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  public static addDaysFromNow(days: number): Date {
    const newDate: Date = new Date();
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  public static addHoursFromNow(hours: number): Date {
    const newDate: Date = new Date();
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  }

  public static addMinutesFromNow(minutes: number): Date {
    const newDate: Date = new Date();
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
  }

  public static addSecondsFromNow(seconds: number): Date {
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
    if (parseInt(month) > 12) throw new Error(`Invalid month ${month}`);

    const expiryDate = new Date(
      (parseInt(year) % 100) + 2000,
      parseInt(month) - 1
    );
    const nowDate = new Date(
      DateUtils.now().getFullYear(),
      DateUtils.now().getMonth()
    );

    if (expiryDate <= nowDate) throw new Error("Expired credit card");
  }
  public static epochToDate(utcSeconds: number): Date {
   // if (!utcSeconds) return null;
    var newDate = new Date(0);
    newDate.setUTCSeconds(utcSeconds);
    return newDate;
  }
}
