"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneAndUpdateUserStatus = exports.findByIdAndDeleteUserStatus = exports.findByIdAndUpdateUserStatus = exports.createUserSatus = exports.countDocumentUserStatus = exports.getUserStatus = exports.getUserStatusById = void 0;
const userStatusModel_1 = __importDefault(require("../models/userStatusModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getUserStatusById(id, queryParams) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await userStatusModel_1.default
        .findById(id)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getUserStatusById = getUserStatusById;
async function getUserStatus(queryParams) {
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
    const data = await userStatusModel_1.default
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getUserStatus = getUserStatus;
async function countDocumentUserStatus(queryParams, userDetails) {
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
    const data = await userStatusModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocumentUserStatus = countDocumentUserStatus;
async function createUserSatus(data) {
    try {
        const userStatus = new userStatusModel_1.default(data);
        const response = await userStatus.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating conference call back : `);
        logger_1.default.error(err);
        return err;
    }
}
exports.createUserSatus = createUserSatus;
async function findByIdAndUpdateUserStatus(query, updates, options) {
    try {
        const updatedBlockList = await userStatusModel_1.default.findByIdAndUpdate(query, updates, options);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in updating user status : ");
        logger_1.default.error(err);
        return false;
    }
}
exports.findByIdAndUpdateUserStatus = findByIdAndUpdateUserStatus;
async function findByIdAndDeleteUserStatus(query) {
    try {
        const updatedBlockList = await userStatusModel_1.default.findByIdAndDelete(query);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in deleting user status : ");
        logger_1.default.error(err);
        return false;
    }
}
exports.findByIdAndDeleteUserStatus = findByIdAndDeleteUserStatus;
async function findOneAndUpdateUserStatus(query, updates, options) {
    try {
        const updatedBlockList = await userStatusModel_1.default.findOneAndUpdate(query, updates, options);
        // console.log("updated user : ",updatedBlockList)
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in updating user status : ");
        logger_1.default.error(err);
        return false;
    }
}
exports.findOneAndUpdateUserStatus = findOneAndUpdateUserStatus;
//# sourceMappingURL=UserStatusModel.js.map