"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCustomSummary = exports.sendInitialSummary = exports.getStatForAccount = void 0;
const allRecords_1 = __importDefault(require("../../models/allRecords"));
const helper_1 = require("../../helper");
const dateHelper_1 = require("../../helper/dateHelper");
const lodash_1 = require("lodash");
const CallTrackingModel_1 = __importDefault(require("../../models/CallTrackingModel"));
const CloudPhoneModel_1 = __importDefault(require("../../models/CloudPhoneModel"));
const LineForwardModel_1 = __importDefault(require("../../models/LineForwardModel"));
const ivrFlowModel_1 = __importDefault(require("../../models/ivrFlowModel"));
// import UserModel from '../../models/UserPermissionUserModel';
// import moment_timezone from 'moment-timezone';
// import moment from 'moment';
const logger_1 = __importDefault(require("../../config/logger"));
function getStatsQueryOfIvrFlow(authId, startDate, endDate) {
    return [
        {
            $match: {
                AccountSid: authId,
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        },
        {
            $project: {
                callDate: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                CallStatus: 1,
                Direction: 1,
                CallerType: 1
            }
        },
        {
            $group: {
                _id: { callDate: "$callDate", callStatus: "$CallStatus", CallerType: "$CallerType" },
                total: { $sum: 1 },
                total_inbound: {
                    $sum: {
                        $switch: {
                            branches: [{
                                    "case": { "$eq": ["$Direction", "inbound"] },
                                    "then": 1
                                },
                            ],
                            default: 0
                        }
                    }
                },
                total_outbound: {
                    $sum: {
                        $switch: {
                            branches: [{
                                    "case": { "$eq": ["$Direction", "outbound-call"] },
                                    "then": 1
                                }],
                            default: 0
                        }
                    }
                },
                total_repeat: {
                    $sum: {
                        $switch: {
                            branches: [{
                                    "case": { "$eq": ["$CallerType", "Repeat"] },
                                    "then": 1
                                },
                            ],
                            default: 0
                        }
                    }
                },
                total_first_time: {
                    $sum: {
                        $switch: {
                            branches: [{
                                    "case": { "$eq": ["$CallerType", "FirstTime"] },
                                    "then": 1
                                }],
                            default: 0
                        }
                    }
                },
            }
        },
        {
            $project: {
                _id: 0,
                callDate: "$_id.callDate",
                callStatus: "$_id.callStatus",
                total: 1,
                total_inbound: 1,
                total_outbound: 1,
                CallerType: "$_id.CallerType"
            }
        },
        {
            $sort: {
                callDate: 1
            }
        }
    ];
}
function getStatsQuery(authId, startDate, endDate) {
    return [
        {
            $match: {
                AccountId: authId,
                subscribeDate: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        },
        {
            $project: {
                callDate: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$subscribeDate"
                    }
                },
                CallStatus: 1,
                Direction: 1,
            }
        },
        {
            $group: {
                _id: { callDate: "$callDate", callStatus: "$CallStatus" },
                total: { $sum: 1 },
                total_inbound: {
                    $sum: {
                        $switch: {
                            branches: [{
                                    "case": { "$eq": ["$Direction", "inbound"] },
                                    "then": 1
                                },
                            ],
                            default: 0
                        }
                    }
                },
                total_outbound: {
                    $sum: {
                        $switch: {
                            branches: [{
                                    "case": { "$eq": ["$Direction", "outbound-call"] },
                                    "then": 1
                                }],
                            default: 0
                        }
                    }
                },
            }
        },
        {
            $project: {
                _id: 0,
                callDate: "$_id.callDate",
                callStatus: "$_id.callStatus",
                total: 1,
                total_inbound: 1,
                total_outbound: 1,
            }
        },
        {
            $sort: {
                callDate: 1
            }
        }
    ];
}
function getStartAndEndDateForRequest(request) {
    let startDateForRequest;
    let endDateForRequest;
    switch (request.timeFrame) {
        case 'This_Week':
            startDateForRequest = (0, helper_1.firstMondayOfWeek)((0, dateHelper_1.today)());
            endDateForRequest = (0, dateHelper_1.addDays)(startDateForRequest, 7);
            break;
        case 'Last_Week':
            startDateForRequest = (0, dateHelper_1.addDays)((0, helper_1.firstMondayOfWeek)((0, dateHelper_1.today)()), -7);
            endDateForRequest = (0, dateHelper_1.addDays)(startDateForRequest, 7);
            break;
        case 'This_Month':
            startDateForRequest = (0, dateHelper_1.firstDayOfMonth)((0, dateHelper_1.today)());
            endDateForRequest = (0, dateHelper_1.addDays)((0, dateHelper_1.lastDayOfMonth)((0, dateHelper_1.today)()), 1);
            break;
        case 'Last_Month':
            startDateForRequest = (0, dateHelper_1.firstDayOfLastMonth)((0, dateHelper_1.today)());
            endDateForRequest = (0, dateHelper_1.addDays)((0, dateHelper_1.lastDayOfMonth)(startDateForRequest), 1);
            break;
        case 'Custom':
            startDateForRequest = request.startDate;
            endDateForRequest = (0, dateHelper_1.addDays)(request.endDate, 1);
            break;
    }
    return { startDate: startDateForRequest, endDate: endDateForRequest };
}
async function getStatForAccount(request) {
    const { startDate, endDate } = getStartAndEndDateForRequest(request);
    let dateWiseStats = {};
    if (request.callSource === 'All') {
        dateWiseStats = await getStatsForAllCalls(startDate, endDate, request.auth_id);
    }
    else if (request.callSource === 'CallTracking') {
        dateWiseStats = await getStatsForCallTrackings(startDate, endDate, request.auth_id);
    }
    else if (request.callSource === 'CloudPhone') {
        dateWiseStats = await getStatsForCloudPhone(startDate, endDate, request.auth_id);
    }
    else if (request.callSource === 'LineForward') {
        // console.log("DateWiseStat 201 : ",dateWiseStats);
        dateWiseStats = await getStatsForLineForward(startDate, endDate, request.auth_id);
    }
    else if (request.callSource === 'IvrFlow') {
        dateWiseStats = await getStatsForIvrFlow(startDate, endDate, request.auth_id);
        //   console.log("DateWiseStat : ",dateWiseStats);
    }
    return summarizeAllRecordResult(dateWiseStats, request.callSource);
}
exports.getStatForAccount = getStatForAccount;
// by me for adding busy status also in Matrix 
function summarizeAllRecordResult(stats, callSource) {
    // console.log("stats : ",stats);
    const groupedByDate = (0, lodash_1.groupBy)(stats, 'callDate');
    // console.log("group by date : ",groupedByDate);
    const callSummary = [];
    for (const iterator of Object.keys(groupedByDate)) {
        let allCalls = 0;
        let connectedCalls = 0;
        let missedCalls = 0;
        let failedCalls = 0;
        let inboundCalls = 0;
        let outboundCalls = 0;
        let repeat = 0;
        let firstTime = 0;
        groupedByDate[iterator].forEach((callStat) => {
            // console.log("callStat : ",callStat);
            if (callStat.callStatus === 'completed') {
                connectedCalls += callStat.total;
            }
            if (callStat.callStatus === 'no-answer') {
                missedCalls += callStat.total;
            }
            if (callStat.callStatus === 'failed') {
                failedCalls += callStat.total;
            }
            if (callStat.callStatus === 'inbound') {
                inboundCalls += callStat.total;
            }
            if (callStat.callStatus === 'outbound-call') {
                outboundCalls += callStat.total;
            }
            if (callStat.callStatus === 'busy') {
                missedCalls += callStat.total;
            }
            if (callStat.callStatus === 'canceled') {
                missedCalls += callStat.total;
            }
            if (callStat.CallerType === 'Repeat') {
                repeat += callStat.total;
            }
            if (callStat.CallerType === 'FirstTime') {
                firstTime += callStat.total;
            }
            // switch (callStat.callStatus) {
            //     case 'initiated':
            //         allCalls = callStat.total;
            //         inboundCalls = callStat.total_inbound;
            //         outboundCalls = callStat.total_outbound;
            //         break;
            //     case 'in-progress':
            //         connectedCalls = callStat.total;
            //         break;
            //     case 'canceled':
            //         missedCalls = callStat.total;
            //         break;
            //     case 'failed':
            //         failedCalls = callStat.total;
            //         break;
            //     case 'no-answer':
            //         missedCalls = callStat.total;
            //         break;
            //     case 'busy':
            //         missedCalls = callStat.total;
            //         break;
            //     case 'completed':
            //         connectedCalls = callStat.total;
            //         break;
            //     default:
            //         // if (callStat.callStatus === 'completed') {
            //         //     if (callSource === 'LineForward') {
            //         //         connectedCalls += callStat.total;
            //         //     }
            //         //     if (callSource === 'IvrFlow') {
            //         //         connectedCalls += callStat.total;
            //         //     }
            //         // }
            //         break;
            // }
        });
        if (callSource === 'LineForward') {
            allCalls = connectedCalls + missedCalls + failedCalls;
            inboundCalls = allCalls;
        }
        if (callSource === 'IvrFlow') {
            allCalls = connectedCalls + missedCalls + failedCalls;
            inboundCalls = allCalls;
        }
        // console.log("allCalls : ",allCalls);
        // console.log("connectedCalls : ",connectedCalls);
        // console.log("missedCalls : ",missedCalls);
        // console.log("failedCalls : ",failedCalls);
        // console.log("inboundCalls : ",inboundCalls);
        // console.log("outboundCalls : ",outboundCalls);
        callSummary.push({
            callDate: iterator,
            allCalls: allCalls,
            connectedCalls: connectedCalls,
            inboundCalls: inboundCalls,
            outboundCalls: outboundCalls,
            missedCalls: missedCalls,
            failedCalls: failedCalls,
            repeatCalls: repeat,
            firstTimeCalls: firstTime
        });
    }
    return callSummary;
}
//by parimal for getting all call stat for all call
// function summarizeAllRecordResult(stats: CallStatForDate[], callSource: CallSource): CallStatSummary[]{
//     const groupedByDate = groupBy(stats, 'callDate');
//     // console.log("group by date : ",groupedByDate);
//     const callSummary: CallStatSummary[] = [];
//     for (const iterator of Object.keys(groupedByDate)) {
//         let allCalls = 0;
//         let connectedCalls = 0;
//         let missedCalls = 0;
//         let failedCalls = 0;
//         let inboundCalls = 0;
//         let outboundCalls = 0;
//         groupedByDate[iterator].forEach((callStat: CallStatForDate) => {
//             // console.log("callStat : ",callStat);
//             switch (callStat.callStatus) {
//                 case 'initiated':
//                     allCalls = callStat.total;
//                     inboundCalls = callStat.total_inbound;
//                     outboundCalls = callStat.total_outbound;
//                     break;
//                 case 'in-progress':
//                     connectedCalls = callStat.total;
//                     break;
//                 case 'canceled':
//                     missedCalls = callStat.total;
//                     break;
//                 case 'failed':
//                     failedCalls = callStat.total;
//                     break;
//                 case 'no-answer':
//                     missedCalls = callStat.total;
//                     break;
//                 case 'busy':
//                     missedCalls = callStat.total;
//                     break;
//                 default:
//                     if (callStat.callStatus === 'completed') {
//                         if (callSource === 'LineForward') {
//                             connectedCalls += callStat.total;
//                         }
//                         if (callSource === 'IvrFlow') {
//                             connectedCalls += callStat.total;
//                         }
//                     }
//             }
//         });
//         if (callSource === 'LineForward') {
//             allCalls = connectedCalls + missedCalls + failedCalls;
//             inboundCalls = allCalls;
//         }
//         if (callSource === 'IvrFlow') {
//             allCalls = connectedCalls + missedCalls + failedCalls;
//             inboundCalls = allCalls;
//         }
//         console.log("allCalls : ",allCalls);
//         callSummary.push({
//             callDate: iterator,
//             allCalls: allCalls,
//             connectedCalls: connectedCalls,
//             inboundCalls: inboundCalls,
//             outboundCalls: outboundCalls,
//             missedCalls: missedCalls,
//             failedCalls: failedCalls,
//         });
//     }
//     return callSummary;
// }
async function getStatsForAllCalls(startDate, endDate, authId) {
    //@ts-ignore
    const data = allRecords_1.default.aggregate(getStatsQuery(authId, startDate, endDate));
    return data.exec();
}
async function getStatsForCallTrackings(startDate, endDate, authId) {
    //@ts-ignore
    const data = CallTrackingModel_1.default.aggregate(getStatsQuery(authId, startDate, endDate));
    return await data.exec();
}
async function getStatsForCloudPhone(startDate, endDate, authId) {
    //@ts-ignore
    const data = CloudPhoneModel_1.default.aggregate(getStatsQuery(authId, startDate, endDate));
    return await data.exec();
}
async function getStatsForLineForward(startDate, endDate, authId) {
    //@ts-ignore
    const data = LineForwardModel_1.default.aggregate(getStatsQuery(authId, startDate, endDate));
    return await data.exec();
}
async function getStatsForIvrFlow(startDate, endDate, authId) {
    //@ts-ignore
    const data = ivrFlowModel_1.default.aggregate(getStatsQueryOfIvrFlow(authId, startDate, endDate));
    // console.log("DateWiseStat : ", await data.exec());
    return await data.exec();
}
// async function getTimeZoneSettedAccordingToUser(receivedTime : Date , authId : string ){
//     console.log("Receive Time : ", receivedTime)
//     console.log("AccountSid of user : ", authId)
//     const userDetails : any = await UserModel.findOne({"auth_id": authId})
//     // console.log("User Details : ", userDetails.timeZone,userDetails)
//     const timeZone = userDetails ? userDetails.timeZone : 'Asia/Kolkata'
//     console.log("Time Zone : ", timeZone)
//     const time = moment_timezone(receivedTime)
//     console.log("TimeZone : ", typeof time.tz(timeZone).format(),time.tz(timeZone).format()) 
//     const convertedTime = time.tz(timeZone).format().split("T")
//     console.log("Converted Hour : ",  convertedTime[1].split(":")[0])
//     const convertedHours = convertedTime[1].split(":")[0] ? convertedTime[1].split(":")[0] : "00"
//     console.log("Converted Minutes : ", convertedTime[1].split(":")[1])
//     const convertedMinutes =convertedTime[1].split(":")[1] ?convertedTime[1].split(":")[1] : "00"
//     const requiredTime = moment(time.tz(timeZone).format()).set({hour : parseInt(convertedHours) , minute : (parseInt(convertedMinutes))}).toDate()
//     console.log("Required Time : ", typeof requiredTime , requiredTime )
// }
function sendInitialSummary(socket, authId) {
    const sources = [
        'CloudPhone',
        'IvrFlow',
    ];
    sources.forEach(async (source) => {
        const todayDate = (0, dateHelper_1.today)();
        const monday = (0, helper_1.firstMondayOfWeek)(todayDate);
        const lastMonday = (0, dateHelper_1.addDays)(monday, -7);
        const lastSunday = (0, dateHelper_1.addDays)(monday, -1);
        const secondLastMonday = (0, dateHelper_1.addDays)(lastMonday, -7);
        const secondLastSunday = (0, dateHelper_1.addDays)(lastMonday, -1);
        //getTimeZoneSettedAccordingToUser(todayDate , authId)
        const thisWeekStats = await getStatForAccount({
            auth_id: authId,
            callSource: source,
            timeFrame: 'Custom',
            startDate: monday,
            endDate: (0, dateHelper_1.addDays)(todayDate, 1)
        });
        const lastWeekStats = await getStatForAccount({
            auth_id: authId,
            callSource: source,
            timeFrame: 'Custom',
            startDate: lastMonday,
            endDate: lastSunday
        });
        const thisWeekSummary = {
            source: source,
            current: thisWeekStats,
            previous: lastWeekStats,
        };
        socket.emit('this_week_summary', thisWeekSummary);
        logger_1.default.info(`date  : ${new Date()} : ${todayDate}`);
        console.log("today local : ", new Date(), todayDate);
        console.log("first day of week : ", monday);
        console.log("today : ", (0, dateHelper_1.addDays)(todayDate, 1));
        const secondLastWeekStats = await getStatForAccount({
            auth_id: authId,
            callSource: source,
            timeFrame: 'Custom',
            startDate: secondLastMonday,
            endDate: secondLastSunday
        });
        const lastWeekSummary = {
            source: source,
            current: lastWeekStats,
            previous: secondLastWeekStats,
        };
        // console.log("lastWeekSummary 362 : ",lastWeekSummary);
        socket.emit('last_week_summary', lastWeekSummary);
        const firstDay = (0, dateHelper_1.firstDayOfMonth)(todayDate);
        const lastDay = (0, dateHelper_1.lastDayOfMonth)(firstDay);
        const lastMonthFirstDay = (0, dateHelper_1.firstDayOfLastMonth)(todayDate);
        const lastMonthLastDay = (0, dateHelper_1.lastDayOfMonth)(lastMonthFirstDay);
        const secondLastMonthFirstDay = (0, dateHelper_1.firstDayOfLastMonth)(lastMonthFirstDay);
        const secondLastMonthLastDay = (0, dateHelper_1.lastDayOfMonth)(secondLastMonthFirstDay);
        const thisYearFirstDay = (0, dateHelper_1.firstDayOfYear)(todayDate);
        console.log("firstDay : ", firstDay);
        console.log("lastDay : ", lastDay);
        console.log("lastMonthFirstDay : ", lastMonthFirstDay);
        console.log("lastMonthLastDay : ", lastMonthLastDay);
        console.log("secondLastMonthFirstDay : ", secondLastMonthFirstDay);
        console.log("secondLastMonthLastDay : ", secondLastMonthLastDay);
        console.log("first day of year : ", thisYearFirstDay);
        const thisMonthStats = await getStatForAccount({
            auth_id: authId,
            callSource: source,
            timeFrame: 'Custom',
            startDate: firstDay,
            // endDate: lastDay
            endDate: (0, dateHelper_1.addDays)(todayDate, 1) // by me to calculate the last date is equal to current date
        });
        const lastMonthStats = await getStatForAccount({
            auth_id: authId,
            callSource: source,
            timeFrame: 'Custom',
            startDate: lastMonthFirstDay,
            endDate: lastMonthLastDay
        });
        const thisMonthSummary = {
            source: source,
            current: thisMonthStats,
            previous: lastMonthStats,
        };
        socket.emit('this_month_summary', thisMonthSummary);
        const thisYearStats = await getStatForAccount({
            auth_id: authId,
            callSource: source,
            timeFrame: 'Custom',
            startDate: thisYearFirstDay,
            endDate: (0, dateHelper_1.addDays)(todayDate, 1)
        });
        const lastYearStats = await getStatForAccount({
            auth_id: authId,
            callSource: source,
            timeFrame: 'Custom',
            startDate: thisYearFirstDay,
            endDate: (0, dateHelper_1.addDays)(todayDate, 1)
        });
        const thisYearSummary = {
            source: source,
            current: thisYearStats,
            previous: lastYearStats
        };
        socket.emit('this_year_summary', thisYearSummary);
        const secondLastMonthStats = await getStatForAccount({
            auth_id: authId,
            callSource: source,
            timeFrame: 'Custom',
            startDate: secondLastMonthFirstDay,
            endDate: secondLastMonthLastDay
        });
        const lastMonthSummary = {
            source: source,
            current: lastMonthStats,
            previous: secondLastMonthStats,
        };
        socket.emit('last_month_summary', lastMonthSummary);
    });
}
exports.sendInitialSummary = sendInitialSummary;
function sendCustomSummary(socket, authId, startDate, endDate) {
    const sources = [
        'CloudPhone',
        'IvrFlow',
    ];
    sources.forEach(async (source) => {
        const thisWeekStats = await getStatForAccount({
            auth_id: authId,
            callSource: source,
            timeFrame: 'Custom',
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });
        const thisWeekSummary = {
            source: source,
            current: thisWeekStats,
            previous: thisWeekStats,
        };
        socket.emit('custom_summary', thisWeekSummary);
    });
}
exports.sendCustomSummary = sendCustomSummary;
//# sourceMappingURL=CallStatsService.js.map