
import moment from 'moment';

export function convertTimeToIST( date : Date ) : Date{
    // Specify the input UTC time
const utcTime = date;

// Calculate the offset for IST (UTC +5:30)
const offsetHours = 5;
const offsetMinutes = 30;
const offsetMilliseconds = (offsetHours * 60 + offsetMinutes) * 60 * 1000;

// Convert to IST
const istTime = new Date(utcTime.getTime() + offsetMilliseconds);

// // Format the IST time as a string
// const formattedIST = istTime.toUTCString();

// console.log(formattedIST);
return istTime
}

export function convertToCloudDate(date : Date) : Date{
    const correctDateForCloud = moment(date).add(5 , 'hours').add(30 , 'minutes').format()
    return new Date(correctDateForCloud)
}

export function today(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return convertTimeToIST(today);
  }
  
  export function firstMondayOfWeek(date: Date) {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const newDate = new Date(date.getTime());
      newDate.setDate(diff)
      return newDate;
  }
  
  export function addDays(date: Date, days: number) {
      const newDate = new Date(date.getTime());
      return new Date(newDate.setDate(date.getDate() + days));
  }
  
  export function firstDayOfMonth(date: Date) {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      return firstMondayOfWeek(firstDay);
  }
  
  export function lastDayOfMonth(date: Date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  
  export function firstDayOfLastMonth(date: Date) {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      return new Date(firstDay.setMonth(firstDay.getMonth() - 1));
  }
  
  export function firstDayOfYear(date: Date) {
      const firstDay = new Date(new Date().getFullYear(), 0, 1);;
      return firstMondayOfWeek(firstDay);
  }