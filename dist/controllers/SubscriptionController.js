"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const PlanModel_1 = require("../services/PlanModel");
const moment_1 = __importDefault(require("moment"));
const SubscriptionModel_1 = require("../services/SubscriptionModel");
const couponModel_1 = require("../services/couponModel");
const helper_1 = require("../helper");
class SubscriptionController extends Index_1.default {
    constructor(model) {
        super(model);
        this.activateSubscription = this.activateSubscription.bind(this);
        this.getById = this.getById.bind(this);
    }
    async getById(req, res) {
        const id = req.JWTUser?.companyId;
        const queryForSubscription = { companyId: id, createdAt: { '$lt': new Date() } };
        const data = await (0, SubscriptionModel_1.getOneSubscription)(queryForSubscription);
        this.data = data ? data : [];
        this.status = true;
        this.code = 200;
        this.message = 'Details fetched!';
        return res.status(200).json(this.Response());
    }
    deactiveCoupon = async (coupons, userId) => {
        // console.log("UserId : ", userId)
        // console.log("Coupons : ", coupons)
        if (coupons[0] === 'TRIAL') {
            console.log("It is a TRIAL coupon!");
            return;
        }
        const uniqueCoupons = coupons.filter((item, index) => coupons.indexOf(item) === index);
        // console.log("Unique : ", uniqueCoupons)
        const queryToDeactiveUser = { value: { $in: uniqueCoupons }, is_used: false };
        const updates = { $set: { is_used: true, used_by: userId, use_time: 1 } };
        const options = { upsert: false };
        await (0, couponModel_1.updateManyCoupons)(queryToDeactiveUser, updates, options);
        return;
    };
    async activateSubscription(req, res) {
        const companyId = req.JWTUser?.companyId;
        const subscriptionId = req.body.subscriptionId;
        // console.log("Coupons : ", req.body.applied_coupons , typeof req.body.applied_coupons)
        if (!subscriptionId) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = 'Provide Subscription ID!';
            return res.status(403).json(this.Response());
        }
        if (!req.body.applied_coupons) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = 'Provide Applied Coupons';
            return res.status(403).json(this.Response());
        }
        if (!Array.isArray(req.body.applied_coupons)) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = 'Provide Applied Coupons in array!';
            return res.status(403).json(this.Response());
        }
        const isValidId = (0, helper_1.isValidMongoDbObjectId)(subscriptionId);
        if (!isValidId) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = "Please check your subscription id";
            return res.status(403).json(this.Response());
        }
        if (!companyId) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = "Please check your company";
            return res.status(403).json(this.Response());
        }
        const detailsNeedToCopy = (await (0, PlanModel_1.getByIdPlan)(subscriptionId));
        if (detailsNeedToCopy) {
            //   console.log("Details Need To Copy : ", detailsNeedToCopy);
            const { price, features, days } = detailsNeedToCopy;
            const queryToGetLastSubscription = { companyId: companyId, sort: "-_id" };
            const lastUpdatedSubscription = await ((0, SubscriptionModel_1.getOneSubscription)(queryToGetLastSubscription));
            //   console.log("lastUpdatedSubscription : ",lastUpdatedSubscription)
            const dayNeedToAdd = days ? days : 0;
            let startDate = (0, moment_1.default)();
            let endDate = (0, moment_1.default)().add(dayNeedToAdd.toString(), "d").endOf('day');
            const isExpired = false;
            const isActive = true;
            const userId = req.JWTUser?._id;
            const isFuturePlan = false;
            if (lastUpdatedSubscription) {
                startDate = (0, moment_1.default)(lastUpdatedSubscription.endDate);
                endDate = (0, moment_1.default)(startDate).add(dayNeedToAdd.toString(), "d").endOf('day');
            }
            const payloadToCreateSubscription = {
                package: detailsNeedToCopy.package,
                price: price,
                features: features,
                startDate: startDate,
                endDate: endDate,
                isExpired: isExpired,
                isActive: isActive,
                userId: userId,
                companyId: companyId,
                isFuturePlan: isFuturePlan,
                name: detailsNeedToCopy.name,
                credits: detailsNeedToCopy.credits
            };
            //   console.log("Paylod : ", payloadToCreateSubscription);
            const response = await (0, SubscriptionModel_1.createSubscription)(payloadToCreateSubscription);
            if (response) {
                //Deactivate Coupon 
                this.deactiveCoupon(req.body.applied_coupons, req.JWTUser?._id);
                this.data = [];
                this.code = 201;
                this.status = true;
                this.message = "Subscription added!";
                return res.status(201).json(this.Response());
            }
            else {
                this.data = [];
                this.status = false;
                this.code = 404;
                this.message = "Something went wrong!";
                return res.status(404).json(this.Response());
            }
        }
        else {
            this.data = [];
            this.code = 403;
            this.message = "Please choose a valid subscription package!";
            this.status = false;
            return res.status(403).json(this.Response());
        }
    }
}
exports.default = SubscriptionController;
//# sourceMappingURL=SubscriptionController.js.map