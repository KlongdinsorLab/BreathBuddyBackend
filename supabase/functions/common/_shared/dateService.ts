export function checkOneDayApart(date1 : Date, date2 : Date) : boolean {
    const date1Tomorrow = new Date(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate() + 1)
    return date1Tomorrow.getUTCFullYear() === date2.getUTCFullYear() 
        && date1Tomorrow.getUTCMonth() === date2.getUTCMonth()
        && date1Tomorrow.getUTCDate() === date2.getUTCDate()
}

export function checkSameDay(date1 : Date, date2 : Date) : boolean {
    return date1.getUTCFullYear() === date2.getUTCFullYear() 
        && date1.getUTCMonth() === date2.getUTCMonth()
        && date1.getUTCDate() === date2.getUTCDate()
}

export function addHours(date : Date, hours : number) : Date {
    const dateCopy = new Date(date.getTime());
    const hoursToAdd = hours * 60 * 60 * 1000;
    dateCopy.setTime(date.getTime() + hoursToAdd);
    return dateCopy;
  }