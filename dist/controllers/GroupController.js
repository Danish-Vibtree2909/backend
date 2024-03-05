"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const groupModel_1 = require("../services/groupModel");
const index_1 = require("../helper/index");
class GroupController extends Index_1.default {
    constructor(model) {
        super(model);
        this.getGroup = this.getGroup.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.updateGroup = this.updateGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.getGroupById = this.getGroupById.bind(this);
    }
    async getGroupById(req, res) {
        const id = req.params.id;
        const query = req.query;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = 'Please check the id!';
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const response = await (0, groupModel_1.getGroupsById)(id, query);
        this.data = response ? response : [];
        this.code = 200;
        this.status = true;
        this.message = 'Details fetched!';
        return res.status(200).json(this.Response());
    }
    async getGroup(req, res) {
        const auth_id = req.JWTUser?.authId;
        const queryParams = { ...req.query, AccountId: auth_id };
        try {
            const groups = await (0, groupModel_1.getGroups)(queryParams);
            const total = await (0, groupModel_1.countGroupsDocuments)(queryParams);
            const data = {
                totalCount: total,
                data: groups,
            };
            this.data = data;
            this.status = true;
            this.message = "SuccessFully found the available groups.";
            return res.json(this.Response());
        }
        catch (err) {
            res.status(401).json({
                status: "Failed",
                message: "Didnt successed",
                err,
            });
        }
    }
    async createGroup(req, res) {
        const auth_id = req.JWTUser?.authId;
        let data = { ...req.body, AccountId: auth_id };
        console.log(data);
        const response = await (0, groupModel_1.createGroups)(data);
        if (response) {
            this.data = response;
            this.status = true;
            this.code = 201;
            this.message = "Group created!";
            return res.status(201).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.code = 404;
            this.message = "Something went wrong!";
            return res.status(404).json(this.Response());
        }
    }
    async updateGroup(req, res) {
        const id = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = 'Please check the id!';
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const myQuery = { _id: id };
        const options = { upsert: false };
        var newValues = { $set: { ...req.body } };
        const groupUpdatedData = await (0, groupModel_1.updateGroupsById)(myQuery, newValues, options);
        if (groupUpdatedData) {
            this.data = [];
            this.status = true;
            this.code = 204;
            this.message = "Group updated!";
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.code = 404;
            this.message = "Something went wrong!";
            return res.status(404).json(this.Response());
        }
    }
    async deleteGroup(req, res) {
        const id = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = 'Please check the id!';
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const myQuery = { _id: id };
        const contactDeletedData = await (0, groupModel_1.deleteOneGroupsById)(myQuery);
        if (contactDeletedData) {
            this.data = [];
            this.status = true;
            this.code = 200;
            this.message = "Group deleted successfully.";
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.code = 404;
            this.message = "Group deleted successfully.";
            return res.status(404).json(this.Response());
        }
    }
}
exports.default = GroupController;
//# sourceMappingURL=GroupController.js.map