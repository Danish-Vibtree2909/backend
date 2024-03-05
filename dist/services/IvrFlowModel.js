"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIvrFlowCdrWithId = exports.getIvrFlowCdrWithId = exports.ivrFlowFindOneAndUpdate = exports.countDocuments = exports.getDetails = void 0;
const ivrFlowModel_1 = __importDefault(require("../models/ivrFlowModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getDetails(queryParams) {
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
    const data = await ivrFlowModel_1.default
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getDetails = getDetails;
async function countDocuments(queryParams) {
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
    const data = await ivrFlowModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocuments = countDocuments;
async function ivrFlowFindOneAndUpdate(query, updates, option) {
    try {
        const response = await ivrFlowModel_1.default.findOneAndUpdate(query, updates, option);
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in updating IvrFlow : ${err}`);
        return false;
    }
}
exports.ivrFlowFindOneAndUpdate = ivrFlowFindOneAndUpdate;
async function getIvrFlowCdrWithId(id, queryParams) {
    const data = await ivrFlowModel_1.default
        .findById(id)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getIvrFlowCdrWithId = getIvrFlowCdrWithId;
async function updateIvrFlowCdrWithId(query, updates, options) {
    const data = await ivrFlowModel_1.default
        .findByIdAndUpdate(query, updates, options);
    return data;
}
exports.updateIvrFlowCdrWithId = updateIvrFlowCdrWithId;
//# sourceMappingURL=IvrFlowModel.js.map