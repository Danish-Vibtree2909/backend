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
exports.getGoogleUser = exports.getGoogleOAuthTokens = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const config = __importStar(require("../config/index"));
const request_1 = __importDefault(require("request"));
const httpClient = request_1.default;
async function getGoogleOAuthTokens({ code, }) {
    const url = "https://oauth2.googleapis.com/token";
    console.log("Code receive to fetch user access_token : ", code);
    const values = {
        code,
        client_id: config.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        redirect_uri: config.GOOGEL_OAUTH_REDIRECT_URI,
        grant_type: "authorization_code",
    };
    const options = {
        method: "post",
        url: url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(values).toString(),
    };
    return new Promise((resolve, reject) => {
        httpClient(options, (err, res, body) => {
            if (err) {
                logger_1.default.error("Error in get google oauth token : " + err);
                throw new Error(err.message);
            }
            const jsonBody = JSON.parse(body);
            resolve(jsonBody);
        });
    });
}
exports.getGoogleOAuthTokens = getGoogleOAuthTokens;
async function getGoogleUser({ id_token, access_token, }) {
    const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
    const options = {
        method: 'get',
        url: url,
        headers: {
            Authorization: `Bearer ${id_token}`,
        },
    };
    return new Promise((resolve, reject) => {
        httpClient.get(options, (err, res, body) => {
            if (err) {
                logger_1.default.error('Error in get google user : ' + err);
                throw new Error(err.message);
            }
            const jsonBody = JSON.parse(body);
            resolve(jsonBody);
        });
    });
}
exports.getGoogleUser = getGoogleUser;
//# sourceMappingURL=GoogleOAuthService.js.map