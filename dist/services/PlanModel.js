"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnePlan = exports.getByIdPlan = exports.findByIdAndDeletePlans = exports.findByIdAndUpdatePlan = exports.createPlan = exports.countDocumentOfPlan = exports.getAllPlans = void 0;
const PlansModel_1 = __importDefault(require("../models/PlansModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getAllPlans(queryParams) {
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
    const data = await PlansModel_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getAllPlans = getAllPlans;
async function countDocumentOfPlan(queryParams) {
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
    const data = await PlansModel_1.default.countDocuments({ ...filterQuery });
    return data;
}
exports.countDocumentOfPlan = countDocumentOfPlan;
async function createPlan(data) {
    try {
        const mongoObj = new PlansModel_1.default(data);
        const response = await mongoObj.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating Plans : ${err}`);
        return err;
    }
}
exports.createPlan = createPlan;
async function findByIdAndUpdatePlan(query, updates, options) {
    try {
        const updatedBlockList = await PlansModel_1.default.findByIdAndUpdate(query, updates, options);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in updating PlanModel : " + err);
        return false;
    }
}
exports.findByIdAndUpdatePlan = findByIdAndUpdatePlan;
async function findByIdAndDeletePlans(query) {
    try {
        const updatedBlockList = await PlansModel_1.default.findByIdAndDelete(query);
        return updatedBlockList;
    }
    catch (err) {
        logger_1.default.error("error in deleting : " + err);
        return false;
    }
}
exports.findByIdAndDeletePlans = findByIdAndDeletePlans;
async function getByIdPlan(id, queryParams) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await PlansModel_1.default
        .findById(id);
    return data;
}
exports.getByIdPlan = getByIdPlan;
async function getOnePlan(queryParams) {
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
    const data = await PlansModel_1.default.findOne({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getOnePlan = getOnePlan;
//# sourceMappingURL=PlanModel.js.map