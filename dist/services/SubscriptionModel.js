"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOneSubscription = exports.createSubscription = exports.getOneSubscription = void 0;
const SubscriptionModel_1 = __importDefault(require("../models/SubscriptionModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getOneSubscription(queryParams) {
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
    // console.log("Query service : ", filterQuery, queryParams);
    const data = await SubscriptionModel_1.default.findOne({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getOneSubscription = getOneSubscription;
async function createSubscription(data) {
    try {
        const mongoObj = new SubscriptionModel_1.default(data);
        const response = await mongoObj.save();
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in creating subscription : ${err}`);
        return false;
    }
}
exports.createSubscription = createSubscription;
async function updateOneSubscription(query, update, options) {
    try {
        const updatedDetails = await SubscriptionModel_1.default.updateOne(query, update, options);
        return updatedDetails;
    }
    catch (err) {
        logger_1.default.error(`Error in updating Subscription : ${err}`);
        return false;
    }
}
exports.updateOneSubscription = updateOneSubscription;
//# sourceMappingURL=SubscriptionModel.js.map