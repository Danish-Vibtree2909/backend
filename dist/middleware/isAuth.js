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
exports.jwtAuth = void 0;
const auth_1 = __importDefault(require("../models/auth"));
const config = __importStar(require("../config/index"));
const jwt = require("jsonwebtoken");
// model
// import Register from '../models/register'
const UnauthorizedRequestException_1 = __importDefault(require("../exceptions/UnauthorizedRequestException"));
/**
 * This function is a miidleware to authenticate the users.
 * @param  {IRequest} req
 * @param  {IResponse} res
 * @param  {any} next
 * @returns Promise
 */
const isAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    const jwtToken = req.headers['jwt-authorization'];
    // console.log("Token : ", token)
    // console.log("JWT Token : ", jwtToken)
    if (!token) {
        // next(new UnauthorizedRequestException());
        return res.status(401).json({
            "code": 401,
            "message": "User is unauthorized",
            "status": false
        });
    }
    const check = await auth_1.default.findOne({ api_token: token });
    if (!check) {
        const verify = await auth_1.default.findOne({ api_token_list: [token] });
        if (!verify) {
            jwt.verify(token, config.jwtSecret, (err, verifiedJwt) => {
                console.log("verified token : ", verifiedJwt);
                if (err) {
                    return res.status(401).json({
                        "code": 401,
                        "message": "User is unauthorized",
                        "status": false
                    });
                }
                return verifiedJwt;
            });
            // next(new UnauthorizedRequestException());
        }
        else {
            req.User = verify;
            return next();
        }
    }
    if (jwtToken) {
        console.log("JWT token found");
        jwt.verify(jwtToken, config.jwtSecret, (err, verifiedJwt) => {
            console.log("Verified User : ", verifiedJwt);
            if (err) {
                next(new UnauthorizedRequestException_1.default());
            }
            return verifiedJwt;
        });
    }
    req.User = check;
    return next();
};
const jwtAuth = async (req, res, next) => {
    const jwtToken = req.headers['jwt-authorization'];
    //  console.log("JWT Token : ", jwtToken)
    if (!jwtToken) {
        // next(new UnauthorizedRequestException());
        return res.status(401).json({
            "code": 401,
            "message": "User is unauthorized",
            "status": false
        });
    }
    else {
        jwt.verify(jwtToken, config.jwtSecret, (err, verifiedJwt) => {
            // console.log("Verified User : ", verifiedJwt)
            if (err) {
                return res.status(401).json({
                    "code": 401,
                    "message": "User is unauthorized",
                    "err": err,
                    "status": false
                });
            }
            req.JWTUser = verifiedJwt;
            return next();
        });
    }
};
exports.jwtAuth = jwtAuth;
exports.default = isAuth;
//# sourceMappingURL=isAuth.js.map