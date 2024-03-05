"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPowerDialerDetailsById = exports.insertManyPowerDialer = exports.deleteManyPowerDialer = exports.findByIdAndDeletePowerDialer = exports.findByIdAndUpdatePowerDialer = exports.createPowerDialer = exports.countDocumentPowerDialer = exports.getAllPowerDialer = void 0;
const powerDialerModel_1 = __importDefault(require("../models/powerDialerModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getAllPowerDialer(queryParams) {
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
    const data = await powerDialerModel_1.default
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getAllPowerDialer = getAllPowerDialer;
async function countDocumentPowerDialer(queryParams, userDetails) {
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
    const data = await powerDialerModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocumentPowerDialer = countDocumentPowerDialer;
async function createPowerDialer(data) {
    try {
        const powerDialer = new powerDialerModel_1.default(data);
        const response = await powerDialer.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating conference call back : `);
        logger_1.default.error(err);
        return err;
    }
}
exports.createPowerDialer = createPowerDialer;
async function findByIdAndUpdatePowerDialer(query, updates, options) {
    try {
        const updatedBlockList = await powerDialerModel_1.default.findByIdAndUpdate(query, updates, options);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error('error in updating power dialer : ');
        logger_1.default.error(err);
        return false;
    }
}
exports.findByIdAndUpdatePowerDialer = findByIdAndUpdatePowerDialer;
async function findByIdAndDeletePowerDialer(query) {
    try {
        const updatedBlockList = await powerDialerModel_1.default.findByIdAndDelete(query);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error('error in deleting power dialer : ');
        logger_1.default.error(err);
        return false;
    }
}
exports.findByIdAndDeletePowerDialer = findByIdAndDeletePowerDialer;
async function deleteManyPowerDialer(query) {
    try {
        const updatedBlockList = await powerDialerModel_1.default.deleteMany(query);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error('error in deleting power dialer : ');
        logger_1.default.error(err);
        return false;
    }
}
exports.deleteManyPowerDialer = deleteManyPowerDialer;
async function insertManyPowerDialer(query) {
    try {
        const updatedBlockList = await powerDialerModel_1.default.insertMany(query);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error('error in insertMany power dialer : ');
        logger_1.default.error(err);
        return false;
    }
}
exports.insertManyPowerDialer = insertManyPowerDialer;
async function getPowerDialerDetailsById(query) {
    try {
        const foundDetails = await powerDialerModel_1.default.findById(query);
        return foundDetails;
    }
    catch (err) {
        logger_1.default.error('error in  get by id of power dialer : ');
        logger_1.default.error(err);
        return false;
    }
}
exports.getPowerDialerDetailsById = getPowerDialerDetailsById;
//# sourceMappingURL=powerDialerModel.js.map