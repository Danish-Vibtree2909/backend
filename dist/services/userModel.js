"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.createUser = exports.findOneAndUpdateUser = exports.getSingleUser = exports.countUserDocuments = exports.getDetailById = exports.getUser = void 0;
const UserPermissionUserModel_1 = __importDefault(require("../models/UserPermissionUserModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getUser(queryParams) {
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
    const data = await UserPermissionUserModel_1.default
        .find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getUser = getUser;
async function getDetailById(id, queryParams) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await UserPermissionUserModel_1.default
        .findById(id)
        .select(queryParams?.fields)
        .populate(queryParams?.populate);
    return data;
}
exports.getDetailById = getDetailById;
async function countUserDocuments(queryParams, userDetails) {
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
    const data = await UserPermissionUserModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countUserDocuments = countUserDocuments;
async function getSingleUser(queryParams) {
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
    const data = await UserPermissionUserModel_1.default
        .findOne({ ...filterQuery })
        .populate(queryParams.populate);
    return data;
}
exports.getSingleUser = getSingleUser;
async function findOneAndUpdateUser(query, updates, options) {
    try {
        const response = await UserPermissionUserModel_1.default.findOneAndUpdate(query, updates, options);
        return response;
    }
    catch (err) {
        logger_1.default.error('Error in updating user : ' + err);
        return false;
    }
}
exports.findOneAndUpdateUser = findOneAndUpdateUser;
async function createUser(data) {
    try {
        const response = new UserPermissionUserModel_1.default(data);
        const userData = await response.save();
        return userData;
    }
    catch (err) {
        logger_1.default.error(`Error in creating user : ${err}`);
        return false;
    }
}
exports.createUser = createUser;
async function deleteUser(query) {
    try {
        const response = await UserPermissionUserModel_1.default.deleteOne(query);
        return response;
    }
    catch (err) {
        logger_1.default.error('Error in deleting user : ' + err);
        return false;
    }
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=userModel.js.map