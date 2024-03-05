"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneConference = exports.createConference = void 0;
const ConferenceModel_1 = __importDefault(require("../models/ConferenceModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function createConference(data) {
    try {
        const conferenceCallBacksModel = new ConferenceModel_1.default(data);
        const response = await conferenceCallBacksModel.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating conference`);
        logger_1.default.error(err);
        return err;
    }
}
exports.createConference = createConference;
async function getOneConference(queryParams) {
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
    const data = await ConferenceModel_1.default
        .findOne({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getOneConference = getOneConference;
//# sourceMappingURL=conferenceModel.js.map