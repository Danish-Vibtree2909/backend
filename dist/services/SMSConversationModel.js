"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countDocumentsSmsConversation = exports.findOneAndUpdateSmsConversatio = exports.getAllSmsConversations = exports.getOneSmsConversation = exports.createSmsConversation = void 0;
const SMSConversationModel_1 = __importDefault(require("../models/SMSConversationModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function createSmsConversation(data) {
    try {
        const response = SMSConversationModel_1.default.create(data);
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating sms conversation : ${err}`);
        return false;
    }
}
exports.createSmsConversation = createSmsConversation;
async function getOneSmsConversation(queryParams) {
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
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await SMSConversationModel_1.default
        .findOne({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getOneSmsConversation = getOneSmsConversation;
async function getAllSmsConversations(queryParams) {
    const filterQuery = { ...queryParams };
    console.log("Filter Query : ", JSON.stringify(filterQuery));
    const excludeApiFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "offset",
        "populate",
        "name",
        "number"
    ];
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await SMSConversationModel_1.default
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getAllSmsConversations = getAllSmsConversations;
async function findOneAndUpdateSmsConversatio(query, update, option) {
    try {
        const response = await SMSConversationModel_1.default.findOneAndUpdate(query, update, option);
        return response;
    }
    catch (err) {
        logger_1.default.error('Error in updating sms conversation : ' + err);
        return false;
    }
}
exports.findOneAndUpdateSmsConversatio = findOneAndUpdateSmsConversatio;
async function countDocumentsSmsConversation(queryParams, userDetails) {
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
    const data = await SMSConversationModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocumentsSmsConversation = countDocumentsSmsConversation;
//# sourceMappingURL=SMSConversationModel.js.map