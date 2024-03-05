"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const UserStatusModel_1 = require("../services/UserStatusModel");
const index_1 = require("../helper/index");
class UserStatusController extends Index_1.default {
    constructor(model) {
        super(model);
        this.getUserById = this.getUserById.bind(this);
        this.getAllUserStatus = this.getAllUserStatus.bind(this);
        this.postUserStatus = this.postUserStatus.bind(this);
        this.udateUserStatus = this.udateUserStatus.bind(this);
        this.deleteUserStatus = this.deleteUserStatus.bind(this);
        this.getStatuOfOwn = this.getStatuOfOwn.bind(this);
    }
    async getStatuOfOwn(req, res) {
        const userId = req.JWTUser?._id;
        const query = { userId: userId };
        const userDetails = await (0, UserStatusModel_1.getUserStatus)(query);
        this.data = userDetails;
        this.code = 200;
        this.status = true;
        this.message = 'Details Fetched';
        return res.status(200).json(this.Response());
    }
    async getUserById(req, res) {
        const query = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(query);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const queryParams = { ...req.query };
        const data = await (0, UserStatusModel_1.getUserStatusById)(query, queryParams);
        if (data) {
            this.data = data;
            this.status = true;
            this.code = 204;
            this.message = "Detail Fetched!";
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = "Something went wrong";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
    }
    async getAllUserStatus(req, res) {
        const authId = req.JWTUser?.authId;
        const query = { ...req.query, authId: authId };
        const userStatusDetails = await (0, UserStatusModel_1.getUserStatus)(query);
        const total = await (0, UserStatusModel_1.countDocumentUserStatus)(query);
        const data = {
            totalCount: total,
            data: userStatusDetails,
        };
        this.code = 200;
        this.data = data;
        this.status = true;
        this.message = "Status Fetched";
        return res.status(200).json(this.Response());
    }
    async postUserStatus(req, res) {
        const authId = req.JWTUser?.authId;
        const userId = req.JWTUser?._id;
        const query = { userId: userId };
        const isUserStatusExist = await (0, UserStatusModel_1.getUserStatus)(query);
        if (isUserStatusExist.length > 0) {
            this.data = [];
            this.status = false;
            this.code = 403;
            this.message = 'User already exist';
            return res.status(403).json(this.Response());
        }
        const body = {
            ...req.body,
            authId: authId,
            userId: userId,
        };
        const userStatus = await (0, UserStatusModel_1.createUserSatus)(body);
        this.data = userStatus;
        this.status = true;
        this.message = "Created Status";
        this.code = 201;
        return res.status(201).json(this.Response());
    }
    async udateUserStatus(req, res) {
        const query = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(query);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const body = req.body;
        const options = { upsert: false };
        const userStatusUpdated = await (0, UserStatusModel_1.findByIdAndUpdateUserStatus)(query, body, options);
        if (userStatusUpdated) {
            this.data = [];
            this.status = true;
            this.message = "Updated User Status";
            this.code = 204;
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
    }
    async deleteUserStatus(req, res) {
        const id = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const userDeleted = await (0, UserStatusModel_1.findByIdAndDeleteUserStatus)(req.params.id);
        if (userDeleted) {
            this.data = [];
            this.status = true;
            this.code = 204;
            this.message = "Detail Deleted!";
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = "Something went wrong";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
    }
}
exports.default = UserStatusController;
//# sourceMappingURL=UserStatusController.js.map