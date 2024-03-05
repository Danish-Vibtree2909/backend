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
const Index_1 = __importDefault(require("./Index"));
const userModel_1 = require("../services/userModel");
const index_1 = require("../helper/index");
const config = __importStar(require("../config/index"));
const jwt = require("jsonwebtoken");
const UserActivityModel_1 = require("../services/UserActivityModel");
const UserStatusModel_1 = require("../services/UserStatusModel");
const index_2 = require("../services/SendInBlue/index");
const index_3 = require("../services/Vibconnect/index");
const companyModel_1 = require("../services/companyModel");
const vibconnectModel_1 = require("../services/vibconnectModel");
const ivrFlowUIModel_1 = __importDefault(require("../models/ivrFlowUIModel"));
const logger_1 = __importDefault(require("../config/logger"));
let emailList = new Map();
class SecurityController extends Index_1.default {
    constructor(model) {
        super(model);
        this.LoginVersionTwo = this.LoginVersionTwo.bind(this);
        this.LogoutVersionTwo = this.LogoutVersionTwo.bind(this);
        this.sendOtpToMail = this.sendOtpToMail.bind(this);
        this.verifyOTP = this.verifyOTP.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.sendOtpToPhoneNumber = this.sendOtpToPhoneNumber.bind(this);
        this.checkIfValueExistInUserDB = this.checkIfValueExistInUserDB.bind(this);
        this.RegisterVersionTwo = this.RegisterVersionTwo.bind(this);
        this.editUser = this.editUser.bind(this);
    }
    editNumberInWorkFlow = async (authId, number, userId) => {
        try {
            const response = await ivrFlowUIModel_1.default.bulkWrite([
                {
                    updateMany: {
                        filter: { "auth_id": authId },
                        update: { $set: { "input.$[elem].data.mpcCallUsingNumbers.$[userElem].number": number } },
                        arrayFilters: [
                            { "elem.type": "MultiPartyCallNode" },
                            { "userElem.userId": userId }
                        ]
                    }
                }
            ]);
            console.log("Response : ", response);
        }
        catch (err) {
            logger_1.default.error('Error in updating number of user in work flow : ' + JSON.stringify(err));
        }
    };
    async editUser(req, res) {
        if (req.body.password) {
            this.data = [];
            this.code = 403;
            this.message = 'You cannot update password!';
            this.status = false;
            return res.status(403).json(this.Response());
        }
        const userId = req.JWTUser?._id;
        const query = { _id: userId };
        const updates = { ...req.body };
        const options = { upsert: false };
        if (req.body.phone) {
            await this.editNumberInWorkFlow(req.JWTUser?.authId, req.body.phone, userId);
        }
        const responseAfterUpdates = await (0, userModel_1.findOneAndUpdateUser)(query, updates, options);
        // console.log("Response : ", responseAfterUpdates)
        if (responseAfterUpdates) {
            this.data = [];
            this.code = 204;
            this.status = true;
            this.message = 'User updated!';
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.code = 404;
            this.message = 'Something went wrong!';
            this.status = false;
            return res.status(404).json(this.Response());
        }
    }
    async RegisterVersionTwo(req, res) {
        const firstName = req.body.firstName ? req.body.firstName : '';
        const lastName = req.body.lastName ? req.body.lastName : '';
        const email = req.body.email;
        const phone = req.body.phone ? req.body.phone : '';
        const token = req.body.token;
        const password = req.body.password ? req.body.password : "Vibtree@123";
        if (!token) {
            this.data = [];
            this.code = 401;
            this.status = false;
            this.message = 'Unauthorized to create account try again!';
            return res.status(401).json(this.Response());
        }
        if (!email) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = 'Provide email!';
            return res.status(403).json(this.Response());
        }
        let companyName = `${firstName}'s Team`;
        jwt.verify(token, config.jwtSecret, async (err, verifiedJwt) => {
            if (err) {
                return res.status(401).json({
                    "code": 401,
                    "message": "User is unauthorized",
                    "err": err,
                    "status": false
                });
            }
            const companyDetails = {
                name: companyName,
                email: email,
                phone: phone
            };
            const random = Math.random().toString(36).substr(2, 25);
            const emailForVibconnect = `${random}@vibtree.com`;
            const adminAuthId = config.VIBCONNECT_ADMIN;
            const adminAuthSecret = config.VIBCONNECT_SECRET;
            const dataFromVibconnect = await (0, index_3.CreateTenantFromTiniyo)(adminAuthId, adminAuthSecret, emailForVibconnect);
            let tenantAuthId;
            let tenantAuthSecret;
            if (dataFromVibconnect) {
                const jsonDataFromVibconnect = JSON.parse(dataFromVibconnect);
                if (jsonDataFromVibconnect.status) {
                    if (jsonDataFromVibconnect.status === 'success') {
                        tenantAuthId = jsonDataFromVibconnect.tenant.auth_id;
                        tenantAuthSecret = jsonDataFromVibconnect.tenant.auth_secret;
                        console.log("Tenant credentials : ", tenantAuthId, tenantAuthSecret);
                        const balance = 10;
                        await (0, index_3.AddPayment)(tenantAuthId, balance);
                        //Create Company
                        const companyDetail = await (0, companyModel_1.createCompany)(companyDetails);
                        if (companyDetail) {
                            const companyId = companyDetail._id ? companyDetail._id : '';
                            const hashedPassword = await (0, index_1.hashPassword)(password);
                            const formatted_data = {
                                fullName: firstName + " " + lastName,
                                username: email,
                                auth_id: tenantAuthId,
                                auth_secret: tenantAuthSecret,
                                email: email,
                                is_verified: true,
                                company_name: companyDetail.name ? companyDetail.name : '',
                                user_type: "company",
                                phone: phone,
                                password: hashedPassword,
                                company_id: companyId,
                                is_admin: true,
                                FirstName: firstName,
                                LastName: lastName,
                                EmailInVibconnect: emailForVibconnect,
                                country_allowed: req.body.country_allowed ? req.body.country_allowed : [{ code: "IND", phone: "91" }],
                                subscription_type: req.body.subscription_type ? req.body.subscription_type : ""
                            };
                            const responseOfCreateUser = await (0, userModel_1.createUser)(formatted_data);
                            if (responseOfCreateUser) {
                                const mailWhomToSend = 'cx@vibtree.com';
                                const Subject = 'New Account Sign-Up';
                                const CustomerEmail = email;
                                const LastName = lastName;
                                const FirstName = firstName ? firstName : "FirstName";
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
                                this.data = responseOfCreateUser;
                                this.status = true;
                                this.code = 201;
                                this.message = 'User created!';
                                return res.status(201).json(this.Response());
                            }
                        }
                    }
                }
                console.log("Data From Vibconnect : ", dataFromVibconnect, lastName);
            }
            return res.status(404).json({ message: "Something went wrong!", status: false, data: [], code: 404 });
        });
    }
    async checkIfValueExistInUserDB(req, res) {
        let queryToFindUser;
        if (req.query.email) {
            queryToFindUser = { email: req.query.email };
        }
        else if (req.query.phone) {
            queryToFindUser = { phone: req.query.phone };
        }
        const isPresent = await (0, userModel_1.countUserDocuments)(queryToFindUser);
        if (!isPresent) {
            this.message = 'Data not found!';
            this.status = false;
            this.code = 404;
            this.data = [];
            return res.status(404).json(this.Response());
        }
        else {
            this.message = 'Data found!';
            this.status = true;
            this.code = 200;
            this.data = [];
            return res.status(200).json(this.Response());
        }
    }
    async sendOtpToPhoneNumber(req, res) {
        const number = req.body.phone;
        if (!number) {
            this.data = [];
            this.status = false;
            this.code = 403;
            this.message = 'Provide phone!';
            return res.status(403).json(this.Response());
        }
        const queryForUser = { phone: number };
        const isUserPresent = await (0, userModel_1.getSingleUser)(queryForUser);
        if (isUserPresent) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const AccountSid = config.AUTH_ID_FOR_OTP;
            const AuthSecret = config.AUTH_SECRET_FOR_OTP;
            const dataOfAccountToSendOtp = {
                "From": "VIB033",
                "To": `+${number}`,
                "Body": `Your OTP is ${otp} \n\nTeam Vibtree`
            };
            const messageResponse = await (0, index_3.sendMessage)(AccountSid, AuthSecret, dataOfAccountToSendOtp);
            emailList.set(number, otp);
            setTimeout(() => {
                emailList.delete(number);
            }, 300000);
            this.data = messageResponse;
            this.code = 200;
            this.status = true;
            this.message = 'OTP SEND SUCCESSFULLY';
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.code = 401;
            this.message = "No user with this phone number is present!";
            return res.status(401).json(this.Response());
        }
    }
    async changePassword(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const phone = req.body.Phone;
        const jwtToken = req.body.token;
        if (!password) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = 'Provide password!';
            return res.status(403).json(this.Response());
        }
        if (!jwtToken) {
            // next(new UnauthorizedRequestException());
            return res.status(401).json({
                "code": 401,
                "message": "User is unauthorized",
                "status": false
            });
        }
        else {
            jwt.verify(jwtToken, config.jwtSecret, async (err, verifiedJwt) => {
                console.log("verify 108 : ", verifiedJwt);
                if (err) {
                    return res.status(401).json({
                        "code": 401,
                        "message": "User is unauthorized",
                        "err": err,
                        "status": false
                    });
                }
                if (email) {
                    let queryForUser = { email: email };
                    const findUser = await (0, userModel_1.getSingleUser)(queryForUser);
                    if (!findUser) {
                        this.status = false;
                        this.code = 401;
                        this.message = "No User exist with this email address";
                        return res.status(401).json(this.Response());
                    }
                    const newHashedPassword = await (0, index_1.hashPassword)(password);
                    const updates = { password: newHashedPassword };
                    const options = { upsert: false };
                    const responseAfterUpdate = await (0, userModel_1.findOneAndUpdateUser)(queryForUser, updates, options);
                    if (responseAfterUpdate) {
                        this.data = [];
                        this.code = 204;
                        this.status = true;
                        this.message = "Password updated!";
                        return res.status(200).json(this.Response());
                    }
                    else {
                        this.data = [];
                        this.code = 404;
                        this.status = false;
                        this.message = 'Something went wrong!';
                        return res.status(403).json(this.Response());
                    }
                }
                else if (phone) {
                    let queryForUser = { phone: phone };
                    const findUser = await (0, userModel_1.getSingleUser)(queryForUser);
                    if (!findUser) {
                        this.status = false;
                        this.code = 401;
                        this.message = "No User exist with this email address";
                        return res.status(401).json(this.Response());
                    }
                    const passwordmatch = await (0, index_1.validatePassword)(password, findUser.password);
                    if (passwordmatch) {
                        this.status = false;
                        this.data = [];
                        this.message = "New password cannot be same as previous";
                        return res.status(403).send(this.Response());
                    }
                    const newHashedPassword = await (0, index_1.hashPassword)(password);
                    const updates = { password: newHashedPassword };
                    const options = { upsert: false };
                    const responseAfterUpdate = await (0, userModel_1.findOneAndUpdateUser)(queryForUser, updates, options);
                    if (responseAfterUpdate) {
                        this.data = [];
                        this.code = 204;
                        this.status = true;
                        this.message = "Password updated!";
                        return res.status(200).json(this.Response());
                    }
                    else {
                        this.data = [];
                        this.code = 404;
                        this.status = false;
                        this.message = 'Something went wrong!';
                        return res.status(403).json(this.Response());
                    }
                }
                else {
                    this.data = [];
                    this.code = 404;
                    this.status = false;
                    this.message = 'Something went wrong!';
                    return res.status(403).json(this.Response());
                }
            });
        }
    }
    async verifyOTP(req, res) {
        const otp = req.body.otp;
        const email = req.body.email;
        const phone = req.body.phone;
        if (email) {
            const isVerified = emailList.get(email);
            if (isVerified) {
                if (isVerified === otp) {
                    const jwtData = { email: email };
                    const jwtToken = jwt.sign(jwtData, config.jwtSecret, { expiresIn: '300s' });
                    emailList.delete(email);
                    this.data = { token: jwtToken };
                    this.status = true;
                    this.code = 200;
                    this.message = "Otp Verified!";
                    return res.status(200).json(this.Response());
                }
                else {
                    this.data = [];
                    this.status = false;
                    this.code = 401;
                    this.message = "OTP not verified!";
                    return res.status(401).json(this.Response());
                }
            }
            else {
                this.data = [];
                this.status = false;
                this.code = 401;
                this.message = "Check e-mail!";
                return res.status(401).json(this.Response());
            }
        }
        else if (phone) {
            const isVerified = emailList.get(phone);
            if (isVerified) {
                if (isVerified === otp) {
                    //Login process
                    const queryForUser = { phone: phone };
                    const findUser = await (0, userModel_1.getSingleUser)(queryForUser);
                    if (!findUser) {
                        this.status = false;
                        this.code = 401;
                        this.message = "No User exist with this email address";
                        return res.status(401).json(this.Response());
                    }
                    const now = Date.now();
                    const data = {
                        _id: findUser?._id,
                        iat: now,
                        authId: findUser?.auth_id,
                        companyId: findUser?.company_id,
                    };
                    const jwtToken = jwt.sign(data, config.jwtSecret, { expiresIn: "14d" });
                    const refreshToken = jwt.sign(data, config.jwtSecret, { expiresIn: "30d" });
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
                    this.data = {
                        jwt_token: jwtToken,
                        refresh_token: refreshToken,
                        authId: findUser.auth_id,
                        phone: findUser.phone ? findUser.phone : "",
                        name: findUser.FirstName ? findUser.FirstName : "",
                        _id: findUser?._id ? findUser?._id : ""
                    };
                    this.message = "User successfully found.";
                    this.code = 200;
                    this.status = true;
                    return res.status(200).json(this.Response());
                    //-------------
                    // const jwtData = {phone : phone}
                    // const jwtToken = jwt.sign(jwtData , config.jwtSecret, {expiresIn : '300s'})
                    // emailList.delete(phone)
                    // this.data = {token : jwtToken}
                    // this.status = true
                    // this.code = 200
                    // this.message = "Otp Verified!"
                    // return res.status(200).json(this.Response())
                }
                else {
                    this.data = [];
                    this.status = false;
                    this.code = 401;
                    this.message = "OTP not verified!";
                    return res.status(401).json(this.Response());
                }
            }
            else {
                this.data = [];
                this.status = false;
                this.code = 401;
                this.message = "Check phone number!";
                return res.status(401).json(this.Response());
            }
        }
        else {
            this.data = [];
            this.status = false;
            this.code = 401;
            this.message = "Something went wrong!";
            return res.status(401).json(this.Response());
        }
    }
    async sendOtpToMail(req, res) {
        const email = req.body.email;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const emailData = { "email": email, "otp": otp };
        console.log("email send data in send otp ", emailData);
        const content = otp.toString();
        const name = "VIB-OTP";
        try {
            const mail_data = await (0, index_2.sendMailUsingSendInBlue)(email, "Vib-CRM verification", content, name);
            console.log("mail data ", mail_data);
            emailList.set(email, otp);
            setTimeout(() => {
                emailList.delete(email);
            }, 300000);
            this.data = mail_data;
            this.code = 200;
            this.status = true;
            this.message = 'OTP SEND SUCCESSFULLY';
            return res.status(200).json(this.Response());
        }
        catch (err) {
            this.data = [];
            this.code = 404;
            this.status = false;
            this.message = 'Something went wrong!';
            return res.status(404).json(this.Response());
        }
    }
    async LogoutVersionTwo(req, res) {
        const auth_id = req.body.authId;
        const _id = req.body.userId;
        if (!auth_id) {
            this.status = false;
            this.code = 403;
            this.message = "Please provide auth_id!";
            this.data = [];
            return res.status(403).json(this.Response());
        }
        if (!_id) {
            this.status = false;
            this.code = 403;
            this.message = "Please provide user id!";
            this.data = [];
            return res.status(403).json(this.Response());
        }
        const dataForUserStatus = {
            authId: auth_id,
            status: "away",
            userId: _id,
        };
        const dataToCreateAuditLogs = {
            auth_id: auth_id,
            user_id: _id,
            type: "logout",
        };
        const queryForUpdatingUserStats = { authId: auth_id };
        const options = { upsert: true };
        (0, UserStatusModel_1.findOneAndUpdateUserStatus)(queryForUpdatingUserStats, dataForUserStatus, options);
        (0, UserActivityModel_1.createUserActivity)(dataToCreateAuditLogs);
        this.status = true;
        this.data = [];
        this.message = "User successfully Logout!";
        this.code = 200;
        return res.status(200).json(this.Response());
    }
    async LoginVersionTwo(req, res) {
        const body = req.body;
        if (!body.email_address) {
            this.status = false;
            this.code = 403;
            this.message = "Please provide email!";
            this.data = [];
            return res.status(403).json(this.Response());
        }
        if (!body.password) {
            this.status = false;
            this.code = 403;
            this.message = "Please provide password!";
            this.data = [];
            return res.status(403).json(this.Response());
        }
        const queryForUser = { email: body.email_address, blocked: false };
        const findUser = await (0, userModel_1.getSingleUser)(queryForUser);
        if (!findUser) {
            this.status = false;
            this.code = 401;
            this.message = "No User exist with this email address";
            this.data = [];
            return res.status(401).json(this.Response());
        }
        const passwordmatch = await (0, index_1.validatePassword)(body.password, findUser.password);
        if (!passwordmatch) {
            this.status = false;
            this.data = [];
            this.message = "Password is incorrect";
            return res.send(this.Response());
        }
        const now = Date.now();
        const data = {
            _id: findUser?._id,
            iat: now,
            authId: findUser?.auth_id,
            companyId: findUser?.company_id,
        };
        const jwtToken = jwt.sign(data, config.jwtSecret, { expiresIn: "14d" });
        const refreshToken = jwt.sign(data, config.jwtSecret, { expiresIn: "30d" });
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
        this.data = {
            jwt_token: jwtToken,
            refresh_token: refreshToken,
            authId: findUser.auth_id,
            phone: findUser.phone ? findUser.phone : "",
            name: findUser.FirstName ? findUser.FirstName : "",
            _id: findUser?._id ? findUser?._id : ""
        };
        this.message = "User successfully found.";
        this.code = 200;
        this.status = true;
        return res.status(200).json(this.Response());
    }
}
exports.default = SecurityController;
//# sourceMappingURL=SecurityController.js.map