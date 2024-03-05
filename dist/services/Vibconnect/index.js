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
exports.handleHold = exports.BuyNumber = exports.AddPayment = exports.CreateTenantFromTiniyo = exports.endConference = exports.killParticularCall = exports.makeCall = exports.sendMessage = void 0;
const request_1 = __importDefault(require("request"));
const logger_1 = __importDefault(require("../../config/logger"));
const httpClient = request_1.default;
const config = __importStar(require("../../config/index"));
class Vibconnect {
    vibconnectBaseUrl = "https://api.vibconnect.io";
    version = "v1";
    constructor(model) {
        this.sendMessage = this.sendMessage.bind(this);
        this.makeCall = this.makeCall.bind(this);
    }
    async sendMessage(authId, authSecretId, data) {
        const link = `${this.vibconnectBaseUrl}/${this.version}/Accounts/${authId}/Messages`;
        const token = authId + ":" + authSecretId;
        const hash = Buffer.from(token).toString("base64");
        const options = {
            method: "POST",
            url: link,
            headers: {
                Authorization: "Basic " + hash,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        //console.log("option : ", options)
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    logger_1.default.error("error in message from vibconnect : " + err);
                    reject(err);
                }
                //logger.info("message response from vibconnect : " + body);
                if (res.statusCode === 404)
                    resolve({
                        sid: "001",
                        date_created: "server-down",
                        date_updated: "server-down",
                        date_sent: "",
                        ParentAccountSid: "WZD6OPMP9LZ5V2UX59N4",
                        account_sid: "server-down",
                        ParentAuthId: "server-down",
                        to: "server-down",
                        from: "server-down",
                        messaging_service_sid: "",
                        body: "server-down",
                        status: "server-down",
                        num_segments: "",
                        num_media: "",
                        direction: "outbound-api",
                        api_version: "2010-04-01",
                        price: "",
                        price_unit: "USD",
                        error_code: "",
                        error_message: "",
                        uri: "server-down",
                        subresource_uris: { media: "server-down" },
                    });
                resolve(body);
            });
        });
    }
    async makeCall(authId, authSecretId, data) {
        const link = `${this.vibconnectBaseUrl}/${this.version}/Accounts/${authId}/Calls`;
        const token = authId + ":" + authSecretId;
        const hash = Buffer.from(token).toString("base64");
        console.log("From : ", data.From);
        if (data.From.includes("918069")) {
            data.From = "+" + data.From.slice(-12);
        }
        if (data.From.includes("91223531")) {
            data.From = "+" + data.From.slice(-12);
        }
        if (data.From.includes("91336811")) {
            data.From = data.From.slice(-12);
        }
        const options = {
            method: "POST",
            url: link,
            headers: {
                Authorization: "Basic " + hash,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        logger_1.default.info("option in making call : " + JSON.stringify(options));
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    logger_1.default.error("error in call from vibconnect : " + err);
                    reject(err);
                }
                logger_1.default.info("call response from vibconnect : " + body);
                resolve(body);
            });
        });
    }
}
exports.default = Vibconnect;
const vibconnectBaseUrl = "https://api.vibconnect.io";
const version = "v1";
async function sendMessage(authId, authSecretId, data) {
    const link = `${vibconnectBaseUrl}/${version}/Accounts/${authId}/Messages`;
    const token = authId + ":" + authSecretId;
    const hash = Buffer.from(token).toString("base64");
    const options = {
        method: "POST",
        url: link,
        headers: {
            Authorization: "Basic " + hash,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    //console.log("option : ", options)
    return new Promise((resolve, reject) => {
        httpClient(options, (err, res, body) => {
            if (err) {
                logger_1.default.error("error in message from vibconnect : " + err);
                reject(err);
            }
            //logger.info("message response from vibconnect : " + body);
            if (res.statusCode === 404)
                resolve({
                    sid: "001",
                    date_created: "server-down",
                    date_updated: "server-down",
                    date_sent: "",
                    ParentAccountSid: "WZD6OPMP9LZ5V2UX59N4",
                    account_sid: "server-down",
                    ParentAuthId: "server-down",
                    to: "server-down",
                    from: "server-down",
                    messaging_service_sid: "",
                    body: "server-down",
                    status: "server-down",
                    num_segments: "",
                    num_media: "",
                    direction: "outbound-api",
                    api_version: "2010-04-01",
                    price: "",
                    price_unit: "USD",
                    error_code: "",
                    error_message: "",
                    uri: "server-down",
                    subresource_uris: { media: "server-down" },
                });
            resolve(body);
        });
    });
}
exports.sendMessage = sendMessage;
async function makeCall(authId, authSecretId, data) {
    const link = `${vibconnectBaseUrl}/${version}/Accounts/${authId}/Calls`;
    const token = authId + ":" + authSecretId;
    const hash = Buffer.from(token).toString("base64");
    console.log("From : ", data.From);
    if (data.From.includes("918069")) {
        data.From = "+" + data.From.slice(-12);
    }
    if (data.From.includes("91223531")) {
        data.From = "+" + data.From.slice(-12);
    }
    if (data.From.includes("91336811")) {
        data.From = data.From.slice(-12);
    }
    const options = {
        method: "POST",
        url: link,
        headers: {
            Authorization: "Basic " + hash,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    logger_1.default.info("option in making call : " + JSON.stringify(options));
    return new Promise((resolve, reject) => {
        httpClient(options, (err, res, body) => {
            if (err) {
                logger_1.default.error("error in call from vibconnect : " + err);
                reject(err);
            }
            logger_1.default.info("call response from vibconnect : " + body);
            resolve(body);
        });
    });
}
exports.makeCall = makeCall;
async function killParticularCall(callId, authId, authSecretId) {
    const link = `${vibconnectBaseUrl}/${version}/Accounts/${authId}/Calls/${callId}`;
    const tok = authId + ":" + authSecretId;
    const hash = Buffer.from(tok).toString("base64");
    const options = {
        method: "POST",
        url: link,
        headers: {
            Authorization: "Basic " + hash,
        },
        body: JSON.stringify({
            Status: "completed",
        }),
    };
    logger_1.default.info("option in delete call : " + JSON.stringify(options));
    return new Promise((resolve, reject) => {
        httpClient(options, (error, response, body) => {
            if (error) {
                logger_1.default.error("error in kill call from vibconnect : " + error);
                reject(error);
            }
            logger_1.default.info("kill call response from vibconnect : " + body);
            resolve(body);
        });
    });
}
exports.killParticularCall = killParticularCall;
async function endConference(auth_id, authSecret_id, conference_id) {
    const link = `${vibconnectBaseUrl}/${version}/Accounts/` +
        auth_id +
        "/Conferences/" +
        conference_id;
    const tok = auth_id + ":" + authSecret_id;
    const hash = Buffer.from(tok).toString("base64");
    const data_to_send = {
        Status: "completed",
    };
    const options = {
        method: "PUT",
        url: link,
        headers: {
            Authorization: "Basic " + hash,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data_to_send,
        }),
    };
    logger_1.default.info("option in end conference : " + JSON.stringify(options));
    return new Promise((resolve, reject) => {
        httpClient(options, (err, res, body) => {
            if (err) {
                logger_1.default.error("error in end conference from vibconnect : " + err);
                reject(err);
            }
            //  console.log("res of target ",res)
            logger_1.default.info("end call response from vibconnect : " + body);
            resolve(body);
        });
    });
}
exports.endConference = endConference;
async function CreateTenantFromTiniyo(auth_id, authSecret_id, email) {
    const link = `${vibconnectBaseUrl}/${version}/Accounts/` + auth_id + "/Tenants/";
    const tok = auth_id + ":" + authSecret_id;
    const hash = Buffer.from(tok).toString("base64");
    console.log("body in target function ", email);
    const data_to_send = {
        email: email,
        first: "Dev",
        last: "Developer",
        password: "Vibtree@123",
        phone1: "0000000000",
    };
    console.log("data to send tiniyo ", data_to_send);
    const options = {
        method: "POST",
        url: link,
        headers: {
            Authorization: "Basic " + hash,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data_to_send,
        }),
    };
    console.log("Options : ", options);
    return new Promise((resolve, reject) => {
        httpClient(options, (err, res, body) => {
            if (err) {
                console.log("error in creating User ", err);
                reject(err);
            }
            console.log("body of created User ", body);
            resolve(body);
        });
    });
}
exports.CreateTenantFromTiniyo = CreateTenantFromTiniyo;
async function AddPayment(auth_id, body) {
    const link = `https://api.siprtc.io/v1/Accounts/${config.VIBCONNECT_ADMIN}/Balances/` +
        auth_id;
    const data_to_send = { auth_id: auth_id, balance: body };
    const options = {
        method: "patch",
        url: link,
        headers: {
            Authorization: `Basic ${config.VIBCONNECT_AUTH_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data_to_send,
        }),
    };
    console.log(options);
    return new Promise((resolve, reject) => {
        httpClient(options, (err, res, body) => {
            if (err) {
                console.log("error in Payment ", err);
                reject(err);
            }
            console.log("body of CompletePayment ", body);
            resolve(body);
        });
    });
}
exports.AddPayment = AddPayment;
async function BuyNumber(id, secret, number) {
    return new Promise((resolve, reject) => {
        const link = `${vibconnectBaseUrl}/${version}` +
            "/Accounts/" +
            id +
            "/PhoneNumbers/" +
            number;
        const tok = id + ":" + secret;
        const hash = Buffer.from(tok).toString("base64");
        const options = {
            headers: {
                Authorization: "Basic " + hash,
            },
        };
        console.log({
            token: id,
            header: options.headers,
        });
        httpClient.post(link, options, (err, res, body) => {
            if (err) {
                reject(err);
            }
            resolve(body);
        });
    });
}
exports.BuyNumber = BuyNumber;
async function handleHold(auth_id, authSecret_id, data) {
    const link = `${vibconnectBaseUrl}/${version}/Accounts/` +
        auth_id +
        "/Conferences/" +
        data.conferenceId +
        "/Participants/" +
        data.callId;
    const tok = auth_id + ":" + authSecret_id;
    const hash = Buffer.from(tok).toString("base64");
    const data_to_send = {
        friendly_name: data.friendly_name,
        hold: data.hold,
        hold_method: data.hold_method,
        hold_url: data.hold_url,
    };
    const options = {
        method: "PUT",
        url: link,
        headers: {
            Authorization: "Basic " + hash,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data_to_send,
        }),
    };
    logger_1.default.info("option in hold conference : " + JSON.stringify(options));
    return new Promise((resolve, reject) => {
        httpClient(options, (err, res, body) => {
            if (err) {
                logger_1.default.error("error in hold conference from vibconnect : " + err);
                reject(err);
            }
            //  console.log("res of target ",res)
            logger_1.default.info("hold conference response from vibconnect : " + body);
            resolve(body);
        });
    });
}
exports.handleHold = handleHold;
//# sourceMappingURL=index.js.map