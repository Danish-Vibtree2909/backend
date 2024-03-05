"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubscriptionModel_1 = require("../services/SubscriptionModel");
const moment_1 = __importDefault(require("moment"));
const dateHelper_1 = require("../helper/dateHelper");
async function validateSubscription(req, res, next) {
    const companyId = req.JWTUser.companyId;
    const subscriptionDetails = await (0, SubscriptionModel_1.getOneSubscription)({
        companyId: companyId,
        sort: "-_id",
    });
    //   console.log("Subscription Details : ", subscriptionDetails);
    if (subscriptionDetails) {
        if (subscriptionDetails.isExpired ||
            (0, moment_1.default)((0, dateHelper_1.addDays)(subscriptionDetails.endDate, 1)).diff(new Date(), "days") <= 0) {
            return res.status(402).json({
                data: [],
                status: false,
                code: 402,
                message: "Sorry your subsription is expired!",
            });
        }
        // console.log("subscriptionDetails.credits : ", subscriptionDetails.credits , typeof subscriptionDetails.credits)
        if (subscriptionDetails.credits < 1) {
            console.log("No credits : ", companyId);
            return res.status(402).json({
                data: [],
                status: false,
                code: 402,
                message: "Sorry you don't have enough credits!",
            });
        }
    }
    return next();
}
exports.default = validateSubscription;
//# sourceMappingURL=Subscription.js.map