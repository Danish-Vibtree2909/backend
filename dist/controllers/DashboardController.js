"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const dateHelper_1 = require("../helper/dateHelper");
const helper_1 = require("../helper");
const IvrFlowModel_1 = require("../services/IvrFlowModel");
const moment_1 = __importDefault(require("moment"));
class DashboardController extends Index_1.default {
    constructor(model) {
        super(model);
        this.dashBoardCallStats = this.dashBoardCallStats.bind(this);
        this.hourlyCallStats = this.hourlyCallStats.bind(this);
    }
    async dashBoardCallStats(req, res) {
        const AccountSid = req.JWTUser?.authId;
        const queryParams = { ...req.query };
        const excludeApiFields = ['page', 'sort', 'limit', 'fields', 'offset', 'populate'];
        excludeApiFields.forEach(e => delete queryParams[e]);
        const timeSource = req.query.timeSource;
        let startDate;
        let endDate;
        const todayDate = (0, dateHelper_1.today)();
        const monday = (0, helper_1.firstMondayOfWeek)(todayDate);
        const lastMonday = (0, dateHelper_1.addDays)(monday, -7);
        const lastSunday = (0, dateHelper_1.addDays)(monday, -1);
        const firstDay = (0, dateHelper_1.firstDayOfMonth)(todayDate);
        const lastDay = (0, dateHelper_1.lastDayOfMonth)(firstDay);
        const lastMonthFirstDay = (0, dateHelper_1.firstDayOfLastMonth)(todayDate);
        const lastMonthLastDay = (0, dateHelper_1.lastDayOfMonth)(lastMonthFirstDay);
        let timeQuery = {};
        if (timeSource === "thisWeek") {
            startDate = monday;
            endDate = (0, dateHelper_1.addDays)(todayDate, 1);
            timeQuery = {
                $gte: startDate,
                $lt: endDate
            };
        }
        if (timeSource === "ThisWeek") {
            startDate = monday;
            endDate = (0, dateHelper_1.addDays)(todayDate, 1);
            timeQuery = {
                $gte: startDate,
                $lt: endDate
            };
        }
        if (timeSource === "LastWeek") {
            startDate = lastMonday;
            endDate = lastSunday;
            timeQuery = {
                $gte: startDate,
                $lt: endDate
            };
        }
        if (timeSource === "ThisMonth") {
            startDate = firstDay;
            endDate = lastDay;
            timeQuery = {
                $gte: startDate,
                $lt: endDate
            };
        }
        if (timeSource === "LastMonth") {
            startDate = lastMonthFirstDay;
            endDate = lastMonthLastDay;
            timeQuery = {
                $gte: startDate,
                $lt: endDate
            };
        }
        if (timeSource === "custom") {
            startDate = req.query.startDate ? req.query.startDate : '';
            endDate = req.query.endDate ? req.query.endDate : '';
            timeQuery = {
                $gte: startDate,
                $lt: endDate
            };
        }
        const timeStampQuery = { createdAt: timeQuery };
        console.log("time stamp query : ", timeStampQuery);
        const selectedFields = ['ParentCallDuration', 'CallerType', 'QueueTime', 'ConnectedChildCallDuration', 'listOfChildCalls'];
        // const data : any = await ivrFlowModel.find({AccountSid : AccountSid , ...timeStampQuery}).limit(Number(req.query.limit)).skip(Number(req.query.offset)).sort(req.query.sort).select(selectedFields)
        // .populate(req.query.populate);
        const fields = { fields: selectedFields };
        const query = { AccountSid: AccountSid, ...timeStampQuery, ...fields };
        const data = await (0, IvrFlowModel_1.getDetails)(query);
        const result = this.calculateDurationStats(data);
        // console.log("total : ", result )
        this.data = result;
        this.message = "Fetch Stats";
        this.status = true;
        this.code = 200;
        return res.json(this.Response());
    }
    calculateDurationStats = (data) => {
        // console.log("data : ", data)
        let totalParentCallDuration = 0;
        let totalConnectedChildCallDuration = 0;
        let totalQueueCallDuration = 0;
        let totalNoOfCalls = data.length;
        let childCallsArray = [];
        for (let i = 0; i < data.length; i++) {
            childCallsArray = [...childCallsArray, ...data[i].listOfChildCalls];
            if (data[i].ParentCallDuration !== undefined && data[i].ParentCallDuration !== null && data[i].ParentCallDuration !== "NaN") {
                totalParentCallDuration = totalParentCallDuration + parseInt(data[i].ParentCallDuration);
            }
            if (data[i].QueueTime !== undefined && data[i].QueueTime !== null && data[i].QueueTime !== "NaN") {
                totalQueueCallDuration = totalQueueCallDuration + parseInt(data[i].QueueTime);
            }
            if (data[i].ConnectedChildCallDuration !== undefined && data[i].ConnectedChildCallDuration !== null && data[i].ConnectedChildCallDuration !== "NaN") {
                totalConnectedChildCallDuration = totalConnectedChildCallDuration + parseInt(data[i].ConnectedChildCallDuration);
            }
        }
        // console.log("list of child calls : ", childCallsArray.length)
        const result = {
            totalConnectedChildCallDuration: totalConnectedChildCallDuration,
            totalParentCallDuration: totalParentCallDuration,
            totalQueueCallDuration: totalQueueCallDuration,
            totalNoOfCalls: totalNoOfCalls,
            totalChildCalls: childCallsArray.length
        };
        return result;
    };
    async hourlyCallStats(req, res) {
        const AccountSid = req.JWTUser?.authId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        if (!startDate || !endDate) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = 'Provide proper date!';
            return res.status(403).json(this.Response());
        }
        const timeZone = req.query.timeZone ? req.query.timeZone : 'IST';
        console.log("Account Sid : ", req.query);
        const flowData = await (0, IvrFlowModel_1.getDetails)({ AccountSid: AccountSid, fields: ["createdAt", "CallStatus"], createdAt: { "$gte": new Date(startDate), "$lte": new Date(endDate) } });
        //console.log("Flow Data : ", flowData)
        const result = this.calculateHourlyStats(flowData, timeZone);
        // for(let i = 0 ; i < flowData.length ; i++) { 
        //     console.log("date : ", flowData[i].createdAt , typeof flowData[i].createdAt)
        // }
        this.data = result;
        this.status = true;
        this.code = 200;
        return res.json(this.Response());
    }
    calculateHourlyStats = (data, timeZone) => {
        //console.log("Data : ",data)
        let value0 = 0;
        let value1 = 0;
        let value2 = 0;
        let value3 = 0;
        let value4 = 0;
        let value5 = 0;
        let value6 = 0;
        let value7 = 0;
        let value8 = 0;
        let value9 = 0;
        let value10 = 0;
        let value11 = 0;
        let value12 = 0;
        let value13 = 0;
        let value14 = 0;
        let value15 = 0;
        let value16 = 0;
        let value17 = 0;
        let value18 = 0;
        let value19 = 0;
        let value20 = 0;
        let value21 = 0;
        let value22 = 0;
        let value23 = 0;
        for (let i = 0; i < data.length; i++) {
            //console.log("date : ", new Date(data[i].createdAt) , typeof new Date(data[i].createdAt))
            let date = new Date(data[i].createdAt);
            //console.log(moment(date).add(5, "hours").add(30, "minutes").format())
            if (timeZone === 'UTC') {
                //console.log(date.getUTCHours())
                switch (date.getUTCHours()) {
                    case 0:
                        value0 = value0 + 1;
                        break;
                    case 1:
                        value1 = value1 + 1;
                        break;
                    case 2:
                        value2 = value2 + 1;
                        break;
                    case 3:
                        value3 = value3 + 1;
                        break;
                    case 4:
                        value4 = value4 + 1;
                        break;
                    case 5:
                        value5 = value5 + 1;
                        break;
                    case 6:
                        value6 = value6 + 1;
                        break;
                    case 7:
                        value7 = value7 + 1;
                        break;
                    case 8:
                        value8 = value8 + 1;
                        break;
                    case 9:
                        value9 = value9 + 1;
                        break;
                    case 10:
                        value10 = value10 + 1;
                        break;
                    case 11:
                        value11 = value11 + 1;
                        break;
                    case 12:
                        value12 = value12 + 1;
                        break;
                    case 13:
                        value13 = value13 + 1;
                        break;
                    case 14:
                        value14 = value14 + 1;
                        break;
                    case 15:
                        value15 = value15 + 1;
                        break;
                    case 16:
                        value16 = value16 + 1;
                        break;
                    case 17:
                        value17 = value17 + 1;
                        break;
                    case 18:
                        value18 = value18 + 1;
                        break;
                    case 19:
                        value19 = value19 + 1;
                        break;
                    case 20:
                        value20 = value20 + 1;
                        break;
                    case 21:
                        value21 = value21 + 1;
                        break;
                    case 22:
                        value22 = value22 + 1;
                        break;
                    case 23:
                        value23 = value23 + 1;
                        break;
                    case 24:
                        value23 = value23 + 1;
                        break;
                    default:
                        break;
                }
            }
            if (timeZone === 'IST') {
                //console.log(date.getHours())
                const istHours = (0, moment_1.default)(date).add(5, "hours").add(30, "minutes").hours();
                // console.log("IST hours : ", istHours)
                switch (istHours) {
                    case 0:
                        value0 = value0 + 1;
                        break;
                    case 1:
                        value1 = value1 + 1;
                        break;
                    case 2:
                        value2 = value2 + 1;
                        break;
                    case 3:
                        value3 = value3 + 1;
                        break;
                    case 4:
                        value4 = value4 + 1;
                        break;
                    case 5:
                        value5 = value5 + 1;
                        break;
                    case 6:
                        value6 = value6 + 1;
                        break;
                    case 7:
                        value7 = value7 + 1;
                        break;
                    case 8:
                        value8 = value8 + 1;
                        break;
                    case 9:
                        value9 = value9 + 1;
                        break;
                    case 10:
                        value10 = value10 + 1;
                        break;
                    case 11:
                        value11 = value11 + 1;
                        break;
                    case 12:
                        value12 = value12 + 1;
                        break;
                    case 13:
                        value13 = value13 + 1;
                        break;
                    case 14:
                        value14 = value14 + 1;
                        break;
                    case 15:
                        value15 = value15 + 1;
                        break;
                    case 16:
                        value16 = value16 + 1;
                        break;
                    case 17:
                        value17 = value17 + 1;
                        break;
                    case 18:
                        value18 = value18 + 1;
                        break;
                    case 19:
                        value19 = value19 + 1;
                        break;
                    case 20:
                        value20 = value20 + 1;
                        break;
                    case 21:
                        value21 = value21 + 1;
                        break;
                    case 22:
                        value22 = value22 + 1;
                        break;
                    case 23:
                        value23 = value23 + 1;
                        break;
                    case 24:
                        value23 = value23 + 1;
                        break;
                    default:
                        break;
                }
            }
        }
        let result = [
            { label: 'last 1', value: value0 },
            { label: '1-2', value: value1 },
            { label: '2-3', value: value2 },
            { label: '3-4', value: value3 },
            { label: '4-5', value: value4 },
            { label: '5-6', value: value5 },
            { label: '6-7', value: value6 },
            { label: '7-8', value: value7 },
            { label: '8-9', value: value8 },
            { label: '9-10', value: value9 },
            { label: '10-11', value: value10 },
            { label: '11-12', value: value11 },
            { label: '12-13', value: value12 },
            { label: '13-14', value: value13 },
            { label: '14-15', value: value14 },
            { label: '15-16', value: value15 },
            { label: '16-17', value: value16 },
            { label: '17-18', value: value17 },
            { label: '18-19', value: value18 },
            { label: '19-20', value: value19 },
            { label: '20-21', value: value20 },
            { label: '21-22', value: value21 },
            { label: '22-23', value: value22 },
            { label: '23-24', value: value13 },
        ];
        //console.log("result : ", result)
        return result;
        //console.log("values : ", value0 , value1 , value2 , value3, value4, value5, value6, value7, value8, value9, value10, value10 , value11 , value12, value13, value14, value14, value15, value16, value17, value18, value19, value20, value21, value22, value23 )
    };
}
exports.default = DashboardController;
//# sourceMappingURL=DashboardController.js.map