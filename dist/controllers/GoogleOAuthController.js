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
exports.googleOauthRegisterHandler = exports.googleOauthHandler = void 0;
const GoogleOAuthService_1 = require("../services/GoogleOAuthService");
const userModel_1 = require("../services/userModel");
const UserStatusModel_1 = require("../services/UserStatusModel");
const UserActivityModel_1 = require("../services/UserActivityModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config = __importStar(require("../config/index"));
const index_1 = require("../services/Vibconnect/index");
const companyModel_1 = require("../services/companyModel");
const userModel_2 = require("../services/userModel");
const vibconnectModel_1 = require("../services/vibconnectModel");
const index_2 = require("../services/SendInBlue/index");
async function googleOauthHandler(req, res) {
    const id_token = req.body.id_token;
    const access_token = req.body.access_token;
    try {
        // get the id and access token with the code provided by google
        // get the code from qs
        //   const code = req.query.code as string;
        // const { id_token, access_token } = await getGoogleOAuthTokens({ code });
        // get user with tokens
        const googleUser = await (0, GoogleOAuthService_1.getGoogleUser)({ id_token, access_token });
        if (!googleUser.verified_email) {
            const response = {
                data: [],
                status: true,
                code: 403,
                message: "Google account is not verified!",
            };
            return res.status(403).json(response);
        }
        // Check if the user exist.
        const query = { email: googleUser.email };
        const findUser = await (0, userModel_1.getSingleUser)(query);
        if (findUser) {
            //return findUser details with token
            const now = Date.now();
            const jwtData = {
                _id: findUser?._id,
                iat: now,
                authId: findUser?.auth_id,
                companyId: findUser?.company_id,
            };
            const jwtToken = jsonwebtoken_1.default.sign(jwtData, config.jwtSecret, {
                expiresIn: "14d",
            });
            const refreshToken = jsonwebtoken_1.default.sign(jwtData, config.jwtSecret, {
                expiresIn: "30d",
            });
            const dataForUserStatus = {
                authId: findUser.auth_id,
                status: "available",
                userId: findUser._id,
            };
            const dataToCreateAuditLogs = {
                auth_id: findUser.auth_id,
                user_id: findUser._id,
                type: "login",
            };
            const queryForUpdatingUserStats = { authId: findUser.auth_id };
            const options = { upsert: true };
            (0, UserStatusModel_1.findOneAndUpdateUserStatus)(queryForUpdatingUserStats, dataForUserStatus, options);
            (0, UserActivityModel_1.createUserActivity)(dataToCreateAuditLogs);
            const response = {
                data: {
                    jwt_token: jwtToken,
                    refresh_token: refreshToken,
                    authId: findUser.auth_id,
                    phone: findUser.phone ? findUser.phone : "",
                    name: findUser.FirstName ? findUser.FirstName : "",
                    _id: findUser?._id ? findUser?._id : "",
                },
                status: true,
                code: 200,
                message: "User found!",
            };
            return res.status(200).json(response);
        }
        else {
            //JWT data
            const response = {
                data: {},
                status: false,
                code: 403,
                message: "User not found!",
            };
            return res.status(402).json(response);
        }
    }
    catch (error) {
        const response = {
            data: [],
            status: true,
            code: 404,
            message: "Something went wrong!",
        };
        return res.status(200).json(response);
    }
}
exports.googleOauthHandler = googleOauthHandler;
async function googleOauthRegisterHandler(req, res) {
    const id_token = req.body.id_token;
    const access_token = req.body.access_token;
    try {
        // get the id and access token with the code provided by google
        // get the code from qs
        //   const code = req.query.code as string;
        // const { id_token, access_token } = await getGoogleOAuthTokens({ code });
        // get user with tokens
        const googleUser = await (0, GoogleOAuthService_1.getGoogleUser)({ id_token, access_token });
        if (!googleUser.verified_email) {
            const response = {
                data: [],
                status: true,
                code: 403,
                message: "Google account is not verified!",
            };
            return res.status(403).json(response);
        }
        // Check if the user exist.
        const query = { email: googleUser.email };
        const findUser = await (0, userModel_1.getSingleUser)(query);
        if (findUser) {
            //return User already exist.
            const response = {
                data: [],
                status: false,
                code: 404,
                message: "User already exist!",
            };
            return res.status(404).json(response);
        }
        else {
            //Create a new User 
            const email = googleUser.email;
            if (!email) {
                return res.status(403).json({
                    "data": [],
                    "status": false,
                    "code": 403,
                    "message": "Something wrong with email!"
                });
            }
            const name = googleUser.name ? googleUser.name : "";
            const photo = googleUser.picture ? googleUser.picture : "";
            // create account in vibconnect 
            const adminAuthId = config.VIBCONNECT_ADMIN;
            const adminAuthSecret = config.VIBCONNECT_SECRET;
            const random = Math.random().toString(36).substr(2, 25);
            const emailForVibconnect = `${random}@vibtree.com`;
            const dataFromVibconnect = await (0, index_1.CreateTenantFromTiniyo)(adminAuthId, adminAuthSecret, emailForVibconnect);
            let tenantAuthId;
            let tenantAuthSecret;
            if (dataFromVibconnect) {
                const jsonDataFromVibconnect = JSON.parse(dataFromVibconnect);
                if (jsonDataFromVibconnect.status) {
                    if (jsonDataFromVibconnect.status === 'success') {
                        tenantAuthId = jsonDataFromVibconnect.tenant.auth_id;
                        tenantAuthSecret = jsonDataFromVibconnect.tenant.auth_secret;
                        // add balance 
                        const balance = 10;
                        await (0, index_1.AddPayment)(tenantAuthId, balance);
                        // Create a company and user in DB
                        let companyName = `${name}'s Team`;
                        const companyDetails = {
                            name: companyName,
                            email: email,
                            phone: ""
                        };
                        const companyDetail = await (0, companyModel_1.createCompany)(companyDetails);
                        if (companyDetail) {
                            const companyId = companyDetail._id ? companyDetail._id : '';
                            const formatted_data = {
                                fullName: name,
                                username: email,
                                auth_id: tenantAuthId,
                                auth_secret: tenantAuthSecret,
                                email: email,
                                is_verified: true,
                                company_name: companyDetail.name ? companyDetail.name : '',
                                user_type: "company",
                                company_id: companyId,
                                is_admin: true,
                                FirstName: name,
                                LastName: "",
                                user_logo: photo,
                                EmailInVibconnect: emailForVibconnect,
                                country_allowed: req.body.country_allowed ? req.body.country_allowed : [{ code: "IND", phone: "91" }],
                                subscription_type: req.body.subscription_type ? req.body.subscription_type : ""
                            };
                            const responseOfCreateUser = await (0, userModel_2.createUser)(formatted_data);
                            if (responseOfCreateUser) {
                                const mailWhomToSend = 'cx@vibtree.com';
                                const Subject = 'New Account Sign-Up';
                                const CustomerEmail = email;
                                const LastName = "";
                                const FirstName = name;
                                const Type = 'business';
                                const Country = 'India';
                                const Company = companyName;
                                const Address = req.body.address ? req.body.address : "not provided";
                                const phoneNumber = req.body.phone_number ? req.body.phone_number : "not provided";
                                const dataForVibInfo = {
                                    authId: tenantAuthId,
                                    authSecret: tenantAuthSecret,
                                    createdBy: responseOfCreateUser._id,
                                    userId: responseOfCreateUser._id,
                                    companyId: companyId
                                };
                                await (0, vibconnectModel_1.createVibconnect)(dataForVibInfo);
                                (0, index_2.sendConfirmationMailUsingSendInBlue)(mailWhomToSend, Subject, CustomerEmail, LastName, FirstName, Type, Country, Company, Address, phoneNumber);
                                const response = {
                                    "data": responseOfCreateUser,
                                    "status": true,
                                    "code": 201,
                                    "message": 'User created!'
                                };
                                return res.status(201).json(response);
                            }
                        }
                    }
                }
                const response = {
                    data: {},
                    status: false,
                    code: 201,
                    message: "User created!",
                };
                return res.status(201).json(response);
            }
            const response = {
                data: [],
                status: true,
                code: 404,
                message: "Something went wrong!",
            };
            return res.status(404).json(response);
        }
    }
    catch (error) {
        const response = {
            data: [],
            status: true,
            code: 404,
            message: "Something went wrong!",
        };
        return res.status(404).json(response);
    }
}
exports.googleOauthRegisterHandler = googleOauthRegisterHandler;
//# sourceMappingURL=GoogleOAuthController.js.map