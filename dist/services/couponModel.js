"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateManyCoupons = exports.getallCoupons = exports.getOneCoupon = void 0;
const CouponModel_1 = __importDefault(require("../models/CouponModel"));
const logger_1 = __importDefault(require("../config/logger"));
async function getOneCoupon(queryParams) {
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
    const data = await CouponModel_1.default.findOne({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getOneCoupon = getOneCoupon;
async function getallCoupons(queryParams) {
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
    const data = await CouponModel_1.default.find({ ...filterQuery })
        .limit(Number(queryParams.limit))
        .skip(Number(queryParams.offset))
        .sort(queryParams.sort)
        .select(queryParams.fields)
        .populate(queryParams.populate);
    return data;
}
exports.getallCoupons = getallCoupons;
async function updateManyCoupons(query, updates, options) {
    try {
        const response = await CouponModel_1.default.updateMany(query, updates, options);
        return response;
    }
    catch (err) {
        logger_1.default.error(`Error in updating many : ${err}`);
        return false;
    }
}
exports.updateManyCoupons = updateManyCoupons;
//# sourceMappingURL=couponModel.js.map