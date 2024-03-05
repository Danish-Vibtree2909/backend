"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstDayOfYear = exports.firstDayOfLastMonth = exports.lastDayOfMonth = exports.firstDayOfMonth = exports.addDays = exports.firstMondayOfWeek = exports.today = exports.convertToCloudDate = exports.convertTimeToIST = void 0;
const moment_1 = __importDefault(require("moment"));
function convertTimeToIST(date) {
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
    return istTime;
}
exports.convertTimeToIST = convertTimeToIST;
function convertToCloudDate(date) {
    const correctDateForCloud = (0, moment_1.default)(date).add(5, 'hours').add(30, 'minutes').format();
    return new Date(correctDateForCloud);
}
exports.convertToCloudDate = convertToCloudDate;
function today() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return convertTimeToIST(today);
}
exports.today = today;
function firstMondayOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const newDate = new Date(date.getTime());
    newDate.setDate(diff);
    return newDate;
}
exports.firstMondayOfWeek = firstMondayOfWeek;
function addDays(date, days) {
    const newDate = new Date(date.getTime());
    return new Date(newDate.setDate(date.getDate() + days));
}
exports.addDays = addDays;
function firstDayOfMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstMondayOfWeek(firstDay);
}
exports.firstDayOfMonth = firstDayOfMonth;
function lastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
exports.lastDayOfMonth = lastDayOfMonth;
function firstDayOfLastMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return new Date(firstDay.setMonth(firstDay.getMonth() - 1));
}
exports.firstDayOfLastMonth = firstDayOfLastMonth;
function firstDayOfYear(date) {
    const firstDay = new Date(new Date().getFullYear(), 0, 1);
    ;
    return firstMondayOfWeek(firstDay);
}
exports.firstDayOfYear = firstDayOfYear;
//# sourceMappingURL=dateHelper.js.map