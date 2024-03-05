"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByIdAllies = exports.findByIdAndDeleteAllies = exports.findByIdAndUpdateAllies = exports.createAllies = exports.countDocumentAllies = exports.getAllAllies = void 0;
const AlliesModel_1 = __importDefault(require("../models/AlliesModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getAllAllies(queryParams) {
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
    const data = await AlliesModel_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getAllAllies = getAllAllies;
async function countDocumentAllies(queryParams, userDetails) {
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
    const data = await AlliesModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocumentAllies = countDocumentAllies;
async function createAllies(data) {
    try {
        const mongoObj = new AlliesModel_1.default(data);
        const response = await mongoObj.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating AlliesModel : `);
        logger_1.default.error(err);
        return err;
    }
}
exports.createAllies = createAllies;
async function findByIdAndUpdateAllies(query, updates, options) {
    try {
        const updatedBlockList = await AlliesModel_1.default.findByIdAndUpdate(query, updates, options);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in updating AlliesModel : ");
        logger_1.default.error(err);
        return false;
    }
}
exports.findByIdAndUpdateAllies = findByIdAndUpdateAllies;
async function findByIdAndDeleteAllies(query) {
    try {
        const updatedBlockList = await AlliesModel_1.default.findByIdAndDelete(query);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in deleting AlliesModel : ");
        logger_1.default.error(err);
        return false;
    }
}
exports.findByIdAndDeleteAllies = findByIdAndDeleteAllies;
async function getByIdAllies(id, queryParams) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await AlliesModel_1.default
        .findById(id)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getByIdAllies = getByIdAllies;
//# sourceMappingURL=AlliesModel.js.map