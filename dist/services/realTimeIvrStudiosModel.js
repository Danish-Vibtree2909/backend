"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRealtimeDetailsById = exports.getRealtimeCallById = exports.findManyAndDeleteRealtimeDetails = exports.findOneAndDeleteRealtimeDetails = exports.updateRealtimeDetails = exports.createDetail = exports.getParticularRealtimeCall = exports.getRealtimeCall = void 0;
const IvrStudiousRealTime_1 = __importDefault(require("../models/IvrStudiousRealTime"));
const logger_1 = __importDefault(require("../config/logger"));
async function getRealtimeCall(queryParams) {
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
    const data = await IvrStudiousRealTime_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getRealtimeCall = getRealtimeCall;
async function getParticularRealtimeCall(queryParams) {
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
    const data = await IvrStudiousRealTime_1.default.findOne({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getParticularRealtimeCall = getParticularRealtimeCall;
async function createDetail(data) {
    try {
        const tempObj = new IvrStudiousRealTime_1.default(data);
        const response = await tempObj.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating RealTime IvrStudios : ${err}`);
        return false;
    }
}
exports.createDetail = createDetail;
async function updateRealtimeDetails(query, updates, options) {
    const response = await IvrStudiousRealTime_1.default.updateOne(query, updates, options);
    return response;
}
exports.updateRealtimeDetails = updateRealtimeDetails;
async function findOneAndDeleteRealtimeDetails(query) {
    const response = await IvrStudiousRealTime_1.default.findOneAndDelete(query);
    return response;
}
exports.findOneAndDeleteRealtimeDetails = findOneAndDeleteRealtimeDetails;
async function findManyAndDeleteRealtimeDetails(query) {
    const response = await IvrStudiousRealTime_1.default.deleteMany(query);
    return response;
}
exports.findManyAndDeleteRealtimeDetails = findManyAndDeleteRealtimeDetails;
async function getRealtimeCallById(id, queryParams) {
    const data = await IvrStudiousRealTime_1.default.findById(id)
        .select(queryParams?.fields)
        .populate(queryParams?.populate);
    return data;
}
exports.getRealtimeCallById = getRealtimeCallById;
async function deleteRealtimeDetailsById(id) {
    try {
        const response = await IvrStudiousRealTime_1.default.findByIdAndDelete(id);
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in deleting ${id} RealTime IvrStudios : ${err}`);
        return false;
    }
}
exports.deleteRealtimeDetailsById = deleteRealtimeDetailsById;
//# sourceMappingURL=realTimeIvrStudiosModel.js.map