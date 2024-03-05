"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoleById = exports.updateRoletById = exports.createRole = exports.getRolesById = exports.countRolesDocuments = exports.getRoles = void 0;
const UserPermissionRoleModel_1 = __importDefault(require("../models/UserPermissionRoleModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getRoles(queryParams) {
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
    const data = await UserPermissionRoleModel_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getRoles = getRoles;
async function countRolesDocuments(queryParams) {
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
    const data = await UserPermissionRoleModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countRolesDocuments = countRolesDocuments;
async function getRolesById(id, queryParams) {
    const data = await UserPermissionRoleModel_1.default.findById(id)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getRolesById = getRolesById;
async function createRole(data) {
    try {
        const contact = new UserPermissionRoleModel_1.default(data);
        const response = await contact.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating role : ${err}`);
        return false;
    }
}
exports.createRole = createRole;
async function updateRoletById(query, updates, options) {
    try {
        const updatedData = await UserPermissionRoleModel_1.default.findByIdAndUpdate(query, updates, options);
        return updatedData;
    }
    catch (err) {
        logger_1.default.error(`Error in updating role : ${err}`);
        return false;
    }
}
exports.updateRoletById = updateRoletById;
async function deleteRoleById(id) {
    try {
        const myQuery = { _id: id };
        const contactDeletedData = await UserPermissionRoleModel_1.default.deleteOne(myQuery);
        return contactDeletedData;
    }
    catch (err) {
        logger_1.default.error(`Error in deleting one Role : ${err}`);
        return false;
    }
}
exports.deleteRoleById = deleteRoleById;
//# sourceMappingURL=userRolesModel.js.map