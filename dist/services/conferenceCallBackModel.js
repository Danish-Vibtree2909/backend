"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConferenceCallBack = exports.getConferenceCallBacks = void 0;
const ConferenceCallBacksModel_1 = __importDefault(require("../models/ConferenceCallBacksModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getConferenceCallBacks(queryParams) {
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
    const data = await ConferenceCallBacksModel_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getConferenceCallBacks = getConferenceCallBacks;
async function createConferenceCallBack(data) {
    try {
        const conferenceCallBacksModel = new ConferenceCallBacksModel_1.default(data);
        const response = await conferenceCallBacksModel.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating conference call back : `);
        logger_1.default.error(err);
        return err;
    }
}
exports.createConferenceCallBack = createConferenceCallBack;
//# sourceMappingURL=conferenceCallBackModel.js.map