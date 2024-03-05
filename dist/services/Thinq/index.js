"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.confirmOrderAfterPurchase = exports.createOrderBeforePurchase = exports.getAllNumberFromInventory = void 0;
const request_1 = __importDefault(require("request"));
const qs_1 = __importDefault(require("qs"));
const httpClient = request_1.default;
const config = __importStar(require("../../config/index"));
async function getAllNumberFromInventory(data) {
    return new Promise((resolve, reject) => {
        const url = config.THINQ_BASEURL;
        const endPoint = `/inbound/get-numbers`;
        const { areaCode } = data;
        const params = {
            searchType: "domestic",
            searchBy: "npa",
            quantity: "50",
            contiguous: "false",
            npa: areaCode,
            related: true,
        };
        const queryString = qs_1.default.stringify(params);
        const userName = config.THINQ_USER;
        const password = config.THINQ_SECRET;
        const token = userName + ":" + password;
        const hash = Buffer.from(token).toString("base64");
        const options = {
            method: "GET",
            url: `${url}${endPoint}?${queryString}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + hash,
            },
        };
        httpClient(options, (error, response, body) => {
            if (error) {
                reject(error);
            }
            const jsonBody = JSON.parse(body);
            resolve(jsonBody);
        });
    });
}
exports.getAllNumberFromInventory = getAllNumberFromInventory;
async function createOrderBeforePurchase(data) {
    return new Promise((resolve, reject) => {
        const url = config.THINQ_BASEURL;
        const { number } = data;
        const endPoint = `/account/${config.THINQ_ACCOUNT_ID}/origination/order/create`;
        const userName = config.THINQ_USER;
        const password = config.THINQ_SECRET;
        const token = userName + ":" + password;
        const hash = Buffer.from(token).toString("base64");
        const body = {
            order: {
                tns: [
                    {
                        caller_id: null,
                        account_location_id: null,
                        sms_routing_profile_id: null,
                        route_id: config.THINQ_ROUTE_ID,
                        features: {
                            cnam: false,
                            sms: true,
                            e911: false,
                        },
                        did: parseInt(number),
                    },
                ],
            },
        };
        const option = {
            method: "POST",
            url: `${url}${endPoint}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + hash,
            },
            body: JSON.stringify({ ...body }),
        };
        console.log("Option : ", option);
        httpClient(option, (error, response, body) => {
            if (error) {
                console.log("Error in creating order : ", error);
                reject(error);
            }
            const jsonBody = JSON.parse(body);
            resolve(jsonBody);
        });
    });
}
exports.createOrderBeforePurchase = createOrderBeforePurchase;
async function confirmOrderAfterPurchase(data) {
    return new Promise((resolve, reject) => {
        const url = config.THINQ_BASEURL;
        const { orderId } = data;
        const endPoint = `/account/${config.THINQ_ACCOUNT_ID}/origination/order/complete/${orderId}`;
        const userName = config.THINQ_USER;
        const password = config.THINQ_SECRET;
        const token = userName + ":" + password;
        const hash = Buffer.from(token).toString("base64");
        var options = {
            method: "POST",
            url: `${url}${endPoint}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + hash,
            },
        };
        httpClient(options, (err, response, body) => {
            if (err) {
                console.log("Error in confirming order of number from thinq : ", err);
                reject(err);
            }
            const jsonResponse = JSON.parse(body);
            resolve(jsonResponse);
        });
    });
}
exports.confirmOrderAfterPurchase = confirmOrderAfterPurchase;
async function sendMessage(data) {
    return new Promise((resolve, reject) => {
        const userName = config.THINQ_USER;
        const password = config.THINQ_SECRET;
        const token = userName + ":" + password;
        const hash = Buffer.from(token).toString("base64");
        const options = {
            'method': 'POST',
            'url': `${config.THINQ_BASEURL}/account/${config.THINQ_ACCOUNT_ID}/product/origination/sms/send`,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + hash
            },
            body: JSON.stringify({ ...data })
        };
        httpClient(options, (error, response, body) => {
            if (error) {
                reject(error);
            }
            const jsonBody = JSON.parse(body);
            resolve(jsonBody);
        });
    });
}
exports.sendMessage = sendMessage;
//# sourceMappingURL=index.js.map