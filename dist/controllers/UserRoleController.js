"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const userRolesModel_1 = require("../services/userRolesModel");
class UserRoleController extends Index_1.default {
    constructor(models) {
        super(models);
        this.getUserRoles = this.getUserRoles.bind(this);
        this.getUserRolesById = this.getUserRolesById.bind(this);
        this.createUserRole = this.createUserRole.bind(this);
        this.updateUserRole = this.updateUserRole.bind(this);
        this.deleteUserRoleById = this.deleteUserRoleById.bind(this);
    }
    async deleteUserRoleById(req, res) {
        const id = req.params.id;
        const response = await (0, userRolesModel_1.deleteRoleById)(id);
        if (response) {
            this.data = [];
            this.status = true;
            this.code = 200;
            this.message = 'Roles deleted!';
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.code = 404;
            this.status = false;
            this.message = 'Something went wrong!';
            return res.status(404).json(this.Response());
        }
    }
    async updateUserRole(req, res) {
        const id = req.params.id;
        const updates = { ...req.body };
        const excludeFields = ['AccountSid'];
        excludeFields.forEach((e) => delete updates[e]);
        const options = { upsert: false };
        const response = await (0, userRolesModel_1.updateRoletById)(id, updates, options);
        if (response) {
            this.data = [];
            this.code = 204;
            this.status = true;
            this.message = 'Updated Roles!';
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.code = 404;
            this.status = false;
            this.message = 'Something went wrong!';
            return res.status(404).json(this.Response());
        }
    }
    async createUserRole(req, res) {
        const authId = req.JWTUser?.authId;
        const data = { ...req.body, AccountSid: authId };
        if (!data.name || !data.type) {
            this.data = [];
            this.code = 403;
            this.message = 'Missing name or type of role!';
            this.status = false;
            return res.status(403).json(this.Response());
        }
        const response = await (0, userRolesModel_1.createRole)(data);
        this.data = response;
        this.code = 201;
        this.message = 'Created Role';
        this.status = true;
        return res.status(201).json(this.Response());
    }
    async getUserRolesById(req, res) {
        const id = req.params.id;
        const query = { ...req.query };
        const data = await (0, userRolesModel_1.getRolesById)(id, query);
        this.data = data;
        this.code = 200;
        this.message = "Details fetched!";
        this.status = true;
        return res.status(200).json(this.Response());
    }
    async getUserRoles(req, res) {
        const authId = req.JWTUser?.authId;
        const queryParams = { ...req.query, AccountSid: authId };
        console.log(queryParams);
        const response = await (0, userRolesModel_1.getRoles)(queryParams);
        const count = await (0, userRolesModel_1.countRolesDocuments)(queryParams);
        const data = {
            data: response,
            totalCount: count
        };
        this.data = data;
        this.code = 200;
        this.message = "Details fetched!";
        this.status = true;
        return res.status(200).json(this.Response());
    }
}
exports.default = UserRoleController;
//# sourceMappingURL=UserRoleController.js.map