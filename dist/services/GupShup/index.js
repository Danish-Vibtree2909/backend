"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const logger_1 = __importDefault(require("../../config/logger"));
const httpClient = request_1.default;
class GupShup {
    gupshupBaseUrl = process.env.GUPSHUP_BASE_URL ||
        "https://media.smsgupshup.com/GatewayAPI/rest";
    constructor(model) {
        this.sendMessage = this.sendMessage.bind(this);
        this.optetUser = this.optetUser.bind(this);
        this.sendMessageWithoutTemplate = this.sendMessageWithoutTemplate.bind(this);
    }
    async sendMessageWithoutTemplate(input) {
        const { userid, password, send_to, v, format, msg_type, method, msg, auth_scheme, } = input;
        console.log("Input : ", input);
        let link = `${this.gupshupBaseUrl}`;
        var options = {
            method: "POST",
            url: link,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            form: {
                method: method,
                userid: userid,
                password: password,
                msg: msg,
                msg_type: msg_type,
                format: format,
                v: v,
                auth_scheme: auth_scheme,
                send_to: send_to,
            },
        };
        logger_1.default.info("Options : " + JSON.stringify(options));
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    logger_1.default.error("error in send normal message from gupshup : " + err);
                    reject(err);
                }
                logger_1.default.info("send normal message response from gupshup : " + body);
                resolve(body);
            });
        });
    }
    async sendMessage(input) {
        const { userid, password, send_to, v, format, msg_type, method, msg, isTemplate, buttonUrlParam, } = input;
        console.log("Input : ", input);
        let link;
        let subUrl;
        if (buttonUrlParam) {
            //link = `${this.gupshupBaseUrl}?userid=${userid}&password=${password}&send_to=${send_to}&v=${v}&format=${format}&msg_type=${msg_type}&method=${method}&msg=${msg}&isTemplate=${isTemplate}&buttonUrlParam=${buttonUrlParam}`;
            subUrl =
                `userid=${userid}&password=${password}&send_to=${send_to}&v=${v}&format=${format}&msg_type=${msg_type}&method=${method}&msg=${msg}&isTemplate=${isTemplate}` +
                    `&buttonUrlParam=${buttonUrlParam}`;
        }
        else {
            if (isTemplate === 'false') {
                subUrl = `userid=${userid}&password=${password}&send_to=${send_to}&v=${v}&format=${format}&msg_type=${msg_type}&method=${method}&msg=${msg}`;
            }
            //link = `${this.gupshupBaseUrl}?userid=${userid}&password=${password}&send_to=${send_to}&v=${v}&format=${format}&msg_type=${msg_type}&method=${method}&msg=${msg}&isTemplate=${isTemplate}`;
            subUrl = `userid=${userid}&password=${password}&send_to=${send_to}&v=${v}&format=${format}&msg_type=${msg_type}&method=${method}&msg=${msg}&isTemplate=${isTemplate}`;
        }
        link = `${this.gupshupBaseUrl}?${subUrl}`;
        var options = {
            method: "GET",
            url: link,
        };
        logger_1.default.info("Options : " + JSON.stringify(options));
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    logger_1.default.error("error in send message from gupshup : " + err);
                    reject(err);
                }
                logger_1.default.info("send message response from gupshup : " + body);
                resolve(body);
            });
        });
    }
    async optetUser(input) {
        const { method, format, userid, password, v, auth_scheme, channel, phone_number, } = input;
        const link = `${this.gupshupBaseUrl}?method=${method}&format=${format}&userid=${userid}&password=${password}&phone_number=${phone_number}&v=${v}&auth_scheme=${auth_scheme}&channel=${channel}`;
        const options = {
            method: "GET",
            url: link,
        };
        console.log("Options : ", options);
        return new Promise((resolve, reject) => {
            httpClient(options, (err, res, body) => {
                if (err) {
                    logger_1.default.error("error in optet from gupshup : " + err);
                    reject(err);
                }
                logger_1.default.info("optet response from gupshup : " + body);
                resolve(body);
            });
        });
    }
}
exports.default = GupShup;
//# sourceMappingURL=index.js.map