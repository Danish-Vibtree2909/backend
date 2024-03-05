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
const fileUploadToS3_1 = require("../middleware/fileUploadToS3");
const config = __importStar(require("../config/index"));
const mime_types_1 = __importDefault(require("mime-types"));
const stream_1 = require("stream");
const index_1 = require("../services/SendInBlue/index");
const userModel_1 = require("../services/userModel");
const jwt = require("jsonwebtoken");
const index_2 = require("../helper/index");
class UserController extends Index_1.default {
    constructor(models) {
        super(models);
        this.downloadUserLogo = this.downloadUserLogo.bind(this);
        this.downloadCompanylogo = this.downloadCompanylogo.bind(this);
        this.uploadUserLogo = this.uploadUserLogo.bind(this);
        this.uploadCompanyLogo = this.uploadCompanyLogo.bind(this);
        this.inviteUser = this.inviteUser.bind(this);
        this.verifyAndCreateUser = this.verifyAndCreateUser.bind(this);
        this.reSendEmail = this.reSendEmail.bind(this);
        this.changePasswordOnly = this.changePasswordOnly.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }
    async deleteUser(req, res) {
        const id = req.params.id;
        const user_id = req.JWTUser?._id;
        // console.log("user id : ",user_id )
        // check if request is made by admin
        const user = await (0, userModel_1.getDetailById)(user_id);
        // console.log("User : ", id ,user)
        if (user.is_admin.toString() === 'true') {
            // if admin make this request delete user 
            const queryToDeleteUser = { _id: id };
            const deletedUser = await (0, userModel_1.deleteUser)(queryToDeleteUser);
            if (deletedUser) {
                this.data = [];
                this.status = true;
                this.code = 200;
                this.message = 'User deleted!';
                return res.status(200).json(this.Response());
            }
            else {
                this.data = [];
                this.status = false;
                this.code = 404;
                this.message = 'Something went wrong!';
                return res.status(401).json(this.Response());
            }
        }
        else {
            // if admin not make this request return unauthorized
            this.data = [];
            this.status = false;
            this.code = 401;
            this.message = 'User is unauthorized!';
            return res.status(401).json(this.Response());
        }
    }
    async changePasswordOnly(req, res) {
        const password = req.body.password;
        const email = req.body.email;
        const query = { email: email };
        const findEmail = await (0, userModel_1.getSingleUser)(query);
        if (findEmail) {
            const hashedPassword = await (0, index_2.hashPassword)(password);
            const update = { password: hashedPassword };
            const option = { upsert: false };
            const responseAfterUpdatingPassword = await (0, userModel_1.findOneAndUpdateUser)(query, update, option);
            if (responseAfterUpdatingPassword) {
                this.data = [];
                this.status = true;
                this.code = 200;
                this.message = "Password updated!";
                return res.status(200).json(this.Response());
            }
            else {
                this.data = [];
                this.status = false;
                this.code = 404;
                this.message = "Password not updated. Try again!";
                return res.status(404).json(this.Response());
            }
        }
        else {
            this.data = [];
            this.status = false;
            this.code = 404;
            this.message = "Password not updated. User not found!";
            return res.status(404).json(this.Response());
        }
    }
    async reSendEmail(req, res) {
        const data = req.body;
        if (Object.keys(req.body).length === 0) {
            return res.status(404).json({
                data: [],
                status: false,
                code: 404,
                message: "No User details provided",
            });
        }
        const existingUser = await (0, userModel_1.getSingleUser)({
            email: data.email,
        });
        if (!existingUser) {
            return res.status(409).json({
                data: [],
                status: false,
                code: 500,
                message: "User does not exist with this email.",
            });
        }
        // create a jwt token that is valid for 1 days
        const token = jwt.sign({ userName: data.username, email: data.email }, config.jwtSecret, { expiresIn: "1d" });
        const invitaionLink = config.BaseUrl + "/UserConfirmation/" + token;
        console.log("invitaionLink", invitaionLink);
        try {
            await (0, index_1.sendMailUsingSendInBlue)(data.email, "Vibtree invites you to join the organiztion.", "<b>You have been invited to join the Vibtree Organization. Please click the below link to complete your registration.</b><a href=" +
                invitaionLink +
                ">Click here!</a>", "Vibtree Technologies");
            this.data = [];
            this.status = true;
            this.code = 200;
            this.message = "Email for registration has been sent to user!";
            this.data = [];
            return res.status(200).json(this.Response());
        }
        catch (err) {
            console.log("error:" + err);
            return res.status(500).json({
                data: [],
                status: false,
                code: 500,
                message: "Error while sending email invitation",
            });
        }
    }
    async verifyAndCreateUser(req, res) {
        const { email } = jwt.verify(req.params.token, config.jwtSecret, (err, verifiedJwt) => {
            if (err) {
                return res.status(401).json({
                    data: [],
                    status: false,
                    code: 401,
                    message: "User is not authorize",
                });
            }
            return verifiedJwt;
        });
        const updateUser = await (0, userModel_1.getSingleUser)({
            email: email,
        });
        if (updateUser) {
            if (updateUser.is_verified == "true") {
                return res.status(400).json({
                    data: [],
                    status: false,
                    code: 400,
                    messaage: "User has been already verified.",
                });
            }
            this.data = [updateUser];
            this.status = true;
            this.code = 200;
            this.message = "User verified! Please set the password.";
            return res.status(200).json(this.Response());
        }
        else {
            return res.status(404).json({
                data: [],
                status: false,
                code: 404,
                messaage: "User does not exist with this email.",
            });
        }
    }
    async inviteUser(req, res) {
        const data = req.body;
        if (Object.keys(req.body).length === 0) {
            return res.status(404).json({
                data: [],
                code: 404,
                status: false,
                message: "Something went wrong!",
            });
        }
        const existingUser = await (0, userModel_1.getSingleUser)({ email: data.email });
        if (existingUser) {
            return res.status(404).json({
                data: [],
                status: true,
                code: 404,
                message: "User already exist!",
            });
        }
        const newUser = {
            is_verified: "false",
            blocked: false,
            username: data.email,
            email: data.email,
            fullName: data.FirstName + " " + data.LastName,
            user_type: data.user_type,
            auth_id: data.auth_id,
            auth_secret: data.auth_secret,
            company_id: data.company_id,
            company_name: data.company_name,
            is_admin: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            FirstName: data.FirstName,
            LastName: data.LastName,
        };
        const responseOfCreateUser = await (0, userModel_1.createUser)(newUser);
        if (responseOfCreateUser) {
            // create a jwt token that is valid for 1 days
            const token = jwt.sign({ userName: data.username, email: data.email }, config.jwtSecret, { expiresIn: "1d" });
            const invitaionLink = config.BASE_URL + "/UserConfirmation/" + token;
            console.log("invitaionLink", invitaionLink);
            try {
                await (0, index_1.sendMailUsingSendInBlue)(data.email, "Vibtree invites you to join the organiztion.", "<b>You have been invited to join the Vibtree Organization. Please click the below link to complete your registration.</b><a href=" +
                    invitaionLink +
                    ">Click here!</a>", "Vibtree Technologies");
                this.data = [];
                this.status = true;
                this.code = 200;
                this.message = "Email for registration has been sent to user!";
                this.data = [];
                return res.status(200).json(this.Response());
            }
            catch (err) {
                await (0, userModel_1.deleteUser)({
                    username: data.username,
                    email: data.email,
                });
                return res.status(404).json({
                    data: [],
                    code: 404,
                    status: false,
                    message: "Error in sending mail!",
                });
            }
        }
        else {
            this.data = [];
            this.code = 404;
            this.status = false;
            this.message = "Error in creating User!";
            return res.status(404).json(this.Response());
        }
    }
    async uploadCompanyLogo(req, res) {
        let fileS3Data = null;
        if (req.file === undefined || req.file === null) {
            return res
                .status(201)
                .json({ data: "", message: "Please upload a file" });
        }
        if (req.file !== undefined) {
            fileS3Data = await (0, fileUploadToS3_1.uploadFile)(config.AWS_BUCKET_NAME + "/Company", req.file);
        }
        if (!fileS3Data.Location) {
            return res.status(400).send("File Not uploaded please try again");
        }
        const FileUrl = fileS3Data.key;
        return res.status(201).json({ data: FileUrl });
    }
    async uploadUserLogo(req, res) {
        let fileS3Data = null;
        if (req.file === undefined || req.file === null) {
            return res.status(404).json({
                data: "",
                message: "Please upload a file",
                status: false,
                code: 404,
            });
        }
        if (req.file !== undefined) {
            fileS3Data = await (0, fileUploadToS3_1.uploadFile)(config.AWS_BUCKET_NAME + "/User", req.file);
        }
        if (!fileS3Data.Location) {
            return res.status(400).send("File Not uploaded please try again");
        }
        const FileUrl = fileS3Data.key;
        return res.status(201).json({ data: FileUrl });
    }
    async downloadUserLogo(req, res) {
        let fileLocation = req.query.fileLocation;
        if (!fileLocation) {
            return res.status(403).send("Please provide details!");
        }
        fileLocation = fileLocation.toString();
        const fileData = await (0, fileUploadToS3_1.downloadFile)(config.AWS_BUCKET_NAME + "/User", fileLocation);
        console.log("file data ", fileData);
        const file = new stream_1.Readable({
            read() {
                this.push(fileData.Body);
                this.push(null);
            },
        });
        const fileNameArr = fileLocation.split("_");
        const filename = fileNameArr[fileNameArr.length - 1];
        const fileExtensionArr = fileLocation.split(".");
        const fileType = fileExtensionArr[fileExtensionArr.length - 1];
        res.setHeader("Content-Disposition", 'attachment: filename="' + filename + '"');
        //@ts-ignore
        res.setHeader("Content-Type", mime_types_1.default.lookup(fileType));
        file.pipe(res);
        return res;
    }
    async downloadCompanylogo(req, res) {
        let fileLocation = req.query.fileLocation;
        if (!fileLocation) {
            return res.status(403).send("Please provide details!");
        }
        fileLocation = fileLocation.toString();
        const fileData = await (0, fileUploadToS3_1.downloadFile)(config.AWS_BUCKET_NAME + "/Company", fileLocation);
        const file = new stream_1.Readable({
            read() {
                this.push(fileData.Body);
                this.push(null);
            },
        });
        const fileNameArr = fileLocation.split("_");
        const filename = fileNameArr[fileNameArr.length - 1];
        const fileExtensionArr = fileLocation.split(".");
        const fileType = fileExtensionArr[fileExtensionArr.length - 1];
        res.setHeader("Content-Disposition", 'attachment: filename="' + filename + '"');
        //@ts-ignore
        res.setHeader("Content-Type", mime_types_1.default.lookup(fileType));
        file.pipe(res);
        return res;
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map