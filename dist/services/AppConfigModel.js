"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByIdAndDeleteAppConfig = exports.getByIdAppConfig = exports.findOneAndUpdateAppConfig = exports.findByIdAndUpdateAppConfig = exports.createAppConfig = exports.countDocumentAppConfig = exports.getOneApplicationConfiguration = exports.getAllApplicationConfiguration = void 0;
const AppConfigModel_1 = __importDefault(require("../models/AppConfigModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getAllApplicationConfiguration(queryParams) {
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
    const data = await AppConfigModel_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getAllApplicationConfiguration = getAllApplicationConfiguration;
async function getOneApplicationConfiguration(queryParams) {
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
    const data = await AppConfigModel_1.default.findOne({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getOneApplicationConfiguration = getOneApplicationConfiguration;
async function countDocumentAppConfig(queryParams, userDetails) {
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
    const data = await AppConfigModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocumentAppConfig = countDocumentAppConfig;
async function createAppConfig(data) {
    try {
        const mongoObj = new AppConfigModel_1.default(data);
        const response = await mongoObj.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating App Config : ${err}`);
        return err;
    }
}
exports.createAppConfig = createAppConfig;
async function findByIdAndUpdateAppConfig(query, updates, options) {
    try {
        const updated = await AppConfigModel_1.default.findByIdAndUpdate(query, updates, options);
        return updated;
    }
    catch (err) {
        logger_1.default.error("error in updating App Config : " + err);
        return false;
    }
}
exports.findByIdAndUpdateAppConfig = findByIdAndUpdateAppConfig;
async function findOneAndUpdateAppConfig(query, updates, options) {
    try {
        const updated = await AppConfigModel_1.default.findOneAndUpdate(query, updates, options);
        return updated;
    }
    catch (err) {
        logger_1.default.error("error in updating App Config : " + err);
        return false;
    }
}
exports.findOneAndUpdateAppConfig = findOneAndUpdateAppConfig;
async function getByIdAppConfig(id, queryParams) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await AppConfigModel_1.default.findById(id)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getByIdAppConfig = getByIdAppConfig;
async function findByIdAndDeleteAppConfig(query) {
    try {
        const updatedBlockList = await AppConfigModel_1.default.findByIdAndDelete(query);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in deleting AppConfigModel : ");
        logger_1.default.error(err);
        return false;
    }
}
exports.findByIdAndDeleteAppConfig = findByIdAndDeleteAppConfig;
//# sourceMappingURL=AppConfigModel.js.map