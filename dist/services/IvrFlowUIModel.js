"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateManyWorkFlow = exports.deleteWorkFlowById = exports.createWorkFlow = exports.updateWorkFlowWithId = exports.getWorkFlowWithId = exports.countWorkFlowDocuments = exports.getWorkFlows = void 0;
const ivrFlowUIModel_1 = __importDefault(require("../models/ivrFlowUIModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getWorkFlows(queryParams) {
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
    const data = await ivrFlowUIModel_1.default
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getWorkFlows = getWorkFlows;
async function countWorkFlowDocuments(queryParams) {
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
    const data = await ivrFlowUIModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countWorkFlowDocuments = countWorkFlowDocuments;
async function getWorkFlowWithId(id, queryParams) {
    const data = await ivrFlowUIModel_1.default
        .findById(id)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getWorkFlowWithId = getWorkFlowWithId;
async function updateWorkFlowWithId(query, updates, options) {
    const data = await ivrFlowUIModel_1.default
        .findByIdAndUpdate(query, updates, options);
    return data;
}
exports.updateWorkFlowWithId = updateWorkFlowWithId;
async function createWorkFlow(data) {
    try {
        const workFlow = new ivrFlowUIModel_1.default(data);
        const response = await workFlow.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating Work Flow : `);
        logger_1.default.error(err);
        return err;
    }
}
exports.createWorkFlow = createWorkFlow;
async function deleteWorkFlowById(id) {
    try {
        const data = await ivrFlowUIModel_1.default.findByIdAndDelete(id);
        return data;
    }
    catch (err) {
        logger_1.default.error(`Error in creating Work Flow : `);
        logger_1.default.error(err);
        return false;
    }
}
exports.deleteWorkFlowById = deleteWorkFlowById;
async function updateManyWorkFlow(query, update, option) {
    try {
        const response = await ivrFlowUIModel_1.default.updateMany(query, update, option);
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in update many workflow : ${err}`);
        return false;
    }
}
exports.updateManyWorkFlow = updateManyWorkFlow;
//# sourceMappingURL=IvrFlowUIModel.js.map