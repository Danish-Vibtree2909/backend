"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFeedbackJson = exports.sendFeedbackFormData = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const request_1 = __importDefault(require("request"));
const httpClient = request_1.default;
async function sendFeedbackFormData(data) {
    const link = 'https://api.famepilot.com/reviews/partner-feedback/';
    var options = {
        'method': 'POST',
        'url': link,
        'headers': {},
        formData: { ...data }
    };
    logger_1.default.info('Option in Sending FeedBack : ' + JSON.stringify(options));
    return new Promise((resolve, reject) => {
        httpClient(options, (error, response, body) => {
            if (error) {
                logger_1.default.error("error in sending feedback : " + error);
                reject(error);
            }
            logger_1.default.info('Response in sending FeedBack : ' + body);
            resolve(body);
        });
    });
}
exports.sendFeedbackFormData = sendFeedbackFormData;
async function sendFeedbackJson(data) {
    const link = 'https://api.famepilot.com/reviews/partner-feedback/';
    const options = {
        'method': 'POST',
        'url': link,
        'headers': {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...data })
    };
    logger_1.default.info('Option in Sending FeedBack : ' + JSON.stringify(options));
    return new Promise((resolve, reject) => {
        httpClient(options, (error, response, body) => {
            if (error) {
                logger_1.default.error("error in sending feedback : " + error);
                reject(error);
            }
            logger_1.default.info('Response in sending FeedBack : ' + body);
            resolve(body);
        });
    });
}
exports.sendFeedbackJson = sendFeedbackJson;
//# sourceMappingURL=wowMomo.js.map