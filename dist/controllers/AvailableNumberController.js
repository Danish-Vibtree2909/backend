"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const availableNumberModel_1 = require("../services/availableNumberModel");
const index_1 = require("../services/Vibconnect/index");
const SubscriptionModel_1 = require("../services/SubscriptionModel");
const vibconnectModel_1 = require("../services/vibconnectModel");
const numberModel_1 = require("../services/numberModel");
const Thinq_1 = require("../services/Thinq");
class AvailableCloudNumberController extends Index_1.default {
    constructor(models) {
        super(models);
        this.fetchAllNumbersFromInventory =
            this.fetchAllNumbersFromInventory.bind(this);
        this.purchaseNumberBasedOnSubscription =
            this.purchaseNumberBasedOnSubscription.bind(this);
        this.fetchAllInternationalNumbers = this.fetchAllInternationalNumbers.bind(this);
        this.orderNumberFromThinqAndConfirm = this.orderNumberFromThinqAndConfirm.bind(this);
    }
    checkStateNameAndReturnStateCode = (stateName) => {
        let stateCode;
        switch (stateName) {
            case "WestBengal":
                stateCode = "9133";
                break;
            case "Mumbai":
                stateCode = "9122";
                break;
            case "Banglore":
                stateCode = "9180";
                break;
            default:
                stateCode = "no-state";
                break;
        }
        return stateCode;
    };
    async fetchAllNumbersFromInventory(req, res) {
        const queryParams = { ...req.query };
        let stateCode;
        // if (!req.query.country || !req.query.type) {
        //   this.data = [];
        //   this.code = 403;
        //   this.message = "country or type missing in query";
        //   this.status = false;
        //   return res.status(403).json(this.Response());
        // }
        if (req.query.stateName) {
            stateCode = this.checkStateNameAndReturnStateCode(req.query.stateName);
            console.log("State Code : ", stateCode);
        }
        const stateCodeFilter = stateCode
            ? { phone_number: { $regex: stateCode } }
            : {};
        let finalFilterQuery = {
            ...queryParams,
            ...stateCodeFilter,
        };
        const userData = await (0, availableNumberModel_1.getAvailableNumbers)(finalFilterQuery);
        const totalCount = await (0, availableNumberModel_1.countAvailableNumbers)(finalFilterQuery);
        const result = { data: userData, totalCount: totalCount };
        this.data = result;
        this.status = true;
        this.code = 200;
        this.message = "Numbers fetched successfully";
        return res.status(200).send(this.Response());
    }
    async purchaseNumberBasedOnSubscription(req, res) {
        const number = req.body.number;
        const userId = req.JWTUser?._id;
        const companyId = req.JWTUser?.companyId ? req.JWTUser?.companyId : false;
        let type = req.body.type;
        if (!type) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = "'type' is missing!";
            return res.status(403).json(this.Response());
        }
        type = type.toUpperCase();
        let totalConsumed = 0;
        let totalAllowed = 0;
        // Get his subscription
        const query = { userId: userId };
        const subscription = await (0, SubscriptionModel_1.getOneSubscription)(query);
        console.log("Subscription : ", subscription, number);
        // Check his number consumtion
        if (type === "VOICE") {
            const voiceDetails = subscription?.features.find((feature) => {
                return feature.name === "VOICE";
            });
            console.log("Voice Detials : ", voiceDetails);
            totalConsumed = voiceDetails.total_consumed;
            totalAllowed = voiceDetails.total_allowed;
        }
        else if (type === "SMS") {
            const smsDetails = subscription?.features.find((feature) => {
                return feature.name === "SMS";
            });
            console.log("Sms Detials : ", smsDetails);
            totalConsumed = smsDetails.total_consumed;
            totalAllowed = smsDetails.total_allowed;
        }
        console.log("Total consumed : ", totalConsumed);
        console.log("Total Allowed : ", totalAllowed);
        //Check eligibity of purchasing number
        if (totalAllowed >= totalConsumed) {
            console.log("He can buy number");
            if (companyId) {
                const query = {
                    companyId: companyId,
                };
                // Get user auth secret from token
                const vibDetails = await (0, vibconnectModel_1.getVibconnect)(query);
                const authSecretId = vibDetails.length > 0 ? vibDetails[0].authSecret : false;
                const authId = req.JWTUser?.authId;
                if (authSecretId) {
                    try {
                        // Purchase number
                        const purchasedNumberDetails = await (0, index_1.BuyNumber)(authId, authSecretId, number);
                        console.log("Purchased Number Details : ", JSON.parse(purchasedNumberDetails));
                        const jsonResponseOfPurchaseNumber = JSON.parse(purchasedNumberDetails);
                        if (jsonResponseOfPurchaseNumber.status) {
                            if (jsonResponseOfPurchaseNumber.status === "failed") {
                                this.data = [];
                                this.code = 403;
                                this.status = false;
                                this.message = "Please try to buy other number!";
                                return res.status(404).json(this.Response());
                            }
                            else {
                                console.log("Add number in our DB");
                                //Add number to purchased number DB
                                const numberDetailsAfterAddingInOurDb = await (0, numberModel_1.createNumber)(jsonResponseOfPurchaseNumber);
                                if (numberDetailsAfterAddingInOurDb) {
                                    console.log("Delete Number from available number list ");
                                    const query = { phone_number: number };
                                    //Delete it from Available number DB
                                    const deletedNumberDetails = await (0, availableNumberModel_1.deleteAvailableNumbers)(query);
                                    //increase the count of consumed number
                                    const queryToUpdateSubscription = {
                                        userId: userId,
                                        features: { $elemMatch: { name: type } },
                                    };
                                    const updatesForSubscription = {
                                        $set: { "features.$.total_consumed": totalConsumed + 1 },
                                    };
                                    const options = { upsert: false, new: true };
                                    const responseAfterUpdatingSubscription = await (0, SubscriptionModel_1.updateOneSubscription)(queryToUpdateSubscription, updatesForSubscription, options);
                                    console.log("Response after editing : ", responseAfterUpdatingSubscription);
                                    if (responseAfterUpdatingSubscription) {
                                        if (deletedNumberDetails) {
                                            this.data = jsonResponseOfPurchaseNumber;
                                            this.code = 201;
                                            this.message = "Successfully purchased number!";
                                            this.status = true;
                                            return res.status(201).json(this.Response());
                                        }
                                        else {
                                            this.data = [];
                                            this.code = 404;
                                            this.status = false;
                                            this.message = "Something went wrong!";
                                            return res.status(404).json(this.Response());
                                        }
                                    }
                                    else {
                                        this.data = [];
                                        this.code = 404;
                                        this.message = "Something went wrong!";
                                        this.status = false;
                                        return res.status(404).json(this.Response());
                                    }
                                }
                            }
                        }
                    }
                    catch (err) {
                        this.data = [];
                        this.code = 404;
                        this.status = false;
                        this.message = err.message;
                        return res.status(404).json(this.Response());
                    }
                }
            }
        }
        else {
            console.log("Ask for deduction from credit.");
            //Get Credits
            const availableCredits = subscription.credits;
            const creditsNeedToBuyNumber = 10000;
            if (availableCredits - creditsNeedToBuyNumber > 0) {
                if (companyId) {
                    const query = {
                        companyId: companyId,
                    };
                    // Get user auth secret from token
                    const vibDetails = await (0, vibconnectModel_1.getVibconnect)(query);
                    const authSecretId = vibDetails.length > 0 ? vibDetails[0].authSecret : false;
                    const authId = req.JWTUser?.authId;
                    if (authSecretId) {
                        try {
                            // Purchase number
                            const purchasedNumberDetails = await (0, index_1.BuyNumber)(authId, authSecretId, number);
                            console.log("Purchased Number Details : ", JSON.parse(purchasedNumberDetails));
                            const jsonResponseOfPurchaseNumber = JSON.parse(purchasedNumberDetails);
                            if (jsonResponseOfPurchaseNumber.status) {
                                if (jsonResponseOfPurchaseNumber.status === "failed") {
                                    this.data = [];
                                    this.code = 403;
                                    this.status = false;
                                    this.message = "Please try to buy other number!";
                                    return res.status(404).json(this.Response());
                                }
                                else {
                                    console.log("Add number in our DB");
                                    //Add number to purchased number DB
                                    const numberDetailsAfterAddingInOurDb = await (0, numberModel_1.createNumber)(jsonResponseOfPurchaseNumber);
                                    if (numberDetailsAfterAddingInOurDb) {
                                        console.log("Delete Number from available number list ");
                                        const query = { phone_number: number };
                                        //Delete it from Available number DB
                                        const deletedNumberDetails = await (0, availableNumberModel_1.deleteAvailableNumbers)(query);
                                        //deduct credits from his account
                                        const queryToUpdateSubscription = { userId: userId };
                                        const updatesForSubscription = {
                                            $set: {
                                                credits: availableCredits - creditsNeedToBuyNumber,
                                            },
                                        };
                                        const options = { upsert: false, new: true };
                                        const responseAfterUpdatingSubscription = await (0, SubscriptionModel_1.updateOneSubscription)(queryToUpdateSubscription, updatesForSubscription, options);
                                        console.log("Response after editing : ", responseAfterUpdatingSubscription);
                                        if (responseAfterUpdatingSubscription) {
                                            if (deletedNumberDetails) {
                                                this.data = jsonResponseOfPurchaseNumber;
                                                this.code = 201;
                                                this.message = "Successfully purchased number!";
                                                this.status = true;
                                                return res.status(201).json(this.Response());
                                            }
                                            else {
                                                this.data = [];
                                                this.code = 404;
                                                this.status = false;
                                                this.message = "Something went wrong!";
                                                return res.status(404).json(this.Response());
                                            }
                                        }
                                        else {
                                            this.data = [];
                                            this.code = 404;
                                            this.message = "Something went wrong!";
                                            this.status = false;
                                            return res.status(404).json(this.Response());
                                        }
                                    }
                                }
                            }
                        }
                        catch (err) {
                            this.data = [];
                            this.code = 404;
                            this.status = false;
                            this.message = err.message;
                            return res.status(404).json(this.Response());
                        }
                    }
                }
            }
            else {
                console.log("Customer do not have credit.");
                this.data = [];
                this.code = 404;
                this.status = false;
                this.message = 'You do not have credits!';
                return res.status(200).json(this.Response());
            }
        }
        return res.status(404).json({
            data: [],
            code: 404,
            status: false,
            message: "Something went wrong",
        });
    }
    async fetchAllInternationalNumbers(req, res) {
        const areaCode = req.query.areaCode;
        if (!areaCode) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = 'Please provide area code!';
            return res.status(403).json(this.Response());
        }
        const tempObj = { 'areaCode': areaCode };
        try {
            const data = await (0, Thinq_1.getAllNumberFromInventory)(tempObj);
            // console.log("Data : ", data)
            if (data.error) {
                this.data = [];
                this.code = data.statusCode;
                this.status = false;
                this.message = data.message;
                return res.status(data.statusCode).json(this.Response());
            }
            this.data = data.dids;
            this.code = 200;
            this.status = true;
            this.message = data.message;
            return res.status(200).json(this.Response());
        }
        catch (err) {
            this.data = [];
            this.code = 404;
            this.status = false;
            this.message = 'Something went wrong!';
            return res.status(200).json(this.Response());
        }
    }
    async orderNumberFromThinqAndConfirm(req, res) {
        const number = req.body.number;
        if (!number) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = 'Provide number!';
            return res.status(403).json(this.Response());
        }
        try {
            //Step 1. Create order to Thinq
            const dataToSend = { number: number };
            const responseAfterCreatingOrderFromThinq = await (0, Thinq_1.createOrderBeforePurchase)(dataToSend);
            const orderId = responseAfterCreatingOrderFromThinq.id;
            console.log("Response Creating : ", responseAfterCreatingOrderFromThinq);
            //Step 2. Confirm order
            if (orderId) {
                const dataToSendConfirmOrder = { orderId: orderId };
                const response = await (0, Thinq_1.confirmOrderAfterPurchase)(dataToSendConfirmOrder);
                console.log("Response Confirm : ", response);
                if (response.error) {
                    this.data = [];
                    this.code = response.statusCode ? response.statusCode : 403;
                    this.status = false;
                    this.message = response.message ? response.message : 'Error in confirming number order!';
                    return res.status(response.statusCode ? response.statusCode : 403).json(this.Response());
                }
                else {
                    this.data = response;
                    this.code = 201;
                    this.status = true;
                    this.message = 'Order confirmed and completed';
                    return res.status(201).json(this.Response());
                }
            }
            else {
                this.data = [];
                this.code = 403;
                this.status = false;
                this.message = 'Error in creating Order';
                return res.status(403).json(this.Response());
            }
        }
        catch (err) {
            this.data = [];
            this.code = 404;
            this.status = false;
            this.message = 'Something went wrong!';
            return res.status(200).json(this.Response());
        }
    }
}
exports.default = AvailableCloudNumberController;
//# sourceMappingURL=AvailableNumberController.js.map