"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneAndUpdateSmsMessage = exports.countDocumentsSmsMessage = exports.getAllSmsMessage = exports.getOneSmsMessage = exports.createSmsMessage = void 0;
const SMSMessageModel_1 = __importDefault(require("../models/SMSMessageModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function createSmsMessage(data) {
    try {
        const response = await SMSMessageModel_1.default.create(data);
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating sms message : ${err}`);
        return false;
    }
}
exports.createSmsMessage = createSmsMessage;
async function getOneSmsMessage(queryParams) {
    const filterQuery = { ...queryParams };
    const excludeApiFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "offset",
        "populate",
    ];
    //@ts-ignore
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await SMSMessageModel_1.default.findOne({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getOneSmsMessage = getOneSmsMessage;
async function getAllSmsMessage(queryParams) {
    const filterQuery = { ...queryParams };
    const excludeApiFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "offset",
        "populate",
    ];
    //@ts-ignore
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await SMSMessageModel_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getAllSmsMessage = getAllSmsMessage;
async function countDocumentsSmsMessage(queryParams, userDetails) {
    const filterQuery = { ...queryParams };
    const excludeApiFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "offset",
        "populate",
    ];
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery);
    const data = await SMSMessageModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocumentsSmsMessage = countDocumentsSmsMessage;
async function findOneAndUpdateSmsMessage(query, update, option) {
    try {
        const response = await SMSMessageModel_1.default.findOneAndUpdate(query, update, option);
        return response;
    }
    catch (err) {
        logger_1.default.error('Error in updating sms conversation : ' + err);
        return false;
    }
}
exports.findOneAndUpdateSmsMessage = findOneAndUpdateSmsMessage;
//# sourceMappingURL=SMSMessageModel.js.map