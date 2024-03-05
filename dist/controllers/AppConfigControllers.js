"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const index_1 = require("../helper/index");
const AppConfigModel_1 = require("../services/AppConfigModel");
class AppConfigController extends Index_1.default {
    constructor(model) {
        super(model);
        this.getAppConfig = this.getAppConfig.bind(this);
        this.createAppConfig = this.createAppConfig.bind(this);
        this.updateAppConfig = this.updateAppConfig.bind(this);
        this.deleteAppConfig = this.deleteAppConfig.bind(this);
        this.getAppConfigById = this.getAppConfigById.bind(this);
        this.getMyConfigAppConfig = this.getMyConfigAppConfig.bind(this);
    }
    async getMyConfigAppConfig(req, res) {
        const authId = req.JWTUser?.authId;
        const userId = req.JWTUser?._id;
        const queryParams = { ...req.query, auth_id: authId, user_id: userId };
        const excludeApiFields = ['page', 'sort', 'limit', 'fields', 'offset', 'populate'];
        excludeApiFields.forEach(e => delete queryParams[e]);
        const appConfig = await (0, AppConfigModel_1.getAllApplicationConfiguration)(queryParams);
        const countDocuments = await (0, AppConfigModel_1.countDocumentAppConfig)(queryParams);
        const data = {
            totalCount: countDocuments,
            data: appConfig
        };
        this.data = data;
        this.status = true;
        this.message = 'Details Fetched';
        this.code = 200;
        return res.status(200).json(this.Response());
    }
    async getAppConfig(req, res) {
        const authId = req.JWTUser?.authId;
        const queryParams = { ...req.query, auth_id: authId };
        const excludeApiFields = ['page', 'sort', 'limit', 'fields', 'offset', 'populate'];
        excludeApiFields.forEach(e => delete queryParams[e]);
        const appConfig = await (0, AppConfigModel_1.getAllApplicationConfiguration)(queryParams);
        const countDocuments = await (0, AppConfigModel_1.countDocumentAppConfig)(queryParams);
        const data = {
            totalCount: countDocuments,
            data: appConfig
        };
        this.data = data;
        this.status = true;
        this.message = 'Details Fetched';
        this.code = 200;
        return res.status(200).json(this.Response());
    }
    async createAppConfig(req, res) {
        const data = req.body;
        const userId = req.JWTUser?._id;
        data.active_by = userId;
        if (data.app_name.toLowerCase() !== 'cloudphone') {
            this.code = 403;
            this.data = [];
            this.message = 'Only CloudPhone config allowed!';
            this.status = false;
            return res.status(403).json(this.Response());
        }
        if (!data.user_id) {
            this.code = 403;
            this.data = [];
            this.status = false;
            this.message = 'No user_id provided!';
            return res.status(403).json(this.Response());
        }
        data.app_name = data.app_name ? data.app_name.toLowerCase() : 'cloudphone';
        data.is_active = data.is_active ? data.is_active : true;
        data.extension_active = data.extension_active ? data.extension_active : true;
        data.phoneApp_active = data.phoneApp_active ? data.phoneApp_active : true;
        data.country_allow = data.country_allow ? data.country_allow : [{ code: "IND", phone: "91" }];
        data.default_country = data.default_country ? data.default_country : { code: "IND", phone: "91" };
        data.cloudNumber_allow = data.cloudNumber_allow ? data.cloudNumber_allow : [];
        data.call_allow = data.call_allow ? data.call_allow : 'both';
        data.type_allow = data.type_allow ? data.type_allow : 'both';
        data.phone_mode = data.phone_mode ? data.phone_mode : 'default';
        data.sip_mode = data.sip_mode ? data.sip_mode : 'default';
        data.sip_active = data.sip_active ? data.sip_active : false;
        const query = { user_id: userId };
        const update = { $set: { ...data } };
        const option = { upsert: true, new: true };
        const newDocument = await (0, AppConfigModel_1.findOneAndUpdateAppConfig)(query, update, option);
        if (newDocument) {
            this.code = 201;
            this.data = newDocument;
            this.status = true;
            this.message = 'Added to AppConfig';
            return res.status(201).json(this.Response());
        }
        else {
            this.code = 404;
            this.data = [];
            this.status = false;
            this.message = 'Something went wrong!';
            return res.status(404).json(this.Response());
        }
    }
    async updateAppConfig(req, res) {
        const query = req.params.id;
        const isValid = (0, index_1.isValidMongoDbObjectId)(query);
        if (isValid) {
            const updates = req.body;
            const options = { upsert: false, new: true };
            const updatedAppConfig = await (0, AppConfigModel_1.findOneAndUpdateAppConfig)(query, updates, options);
            if (!updatedAppConfig) {
                this.code = 404;
                this.data = [];
                this.status = false;
                this.message = 'Details not found!';
                return res.status(404).json(this.Response());
            }
            else {
                this.code = 202;
                this.data = updatedAppConfig;
                this.status = true;
                this.message = 'Updated AppConfig';
                return res.status(200).json(this.Response());
            }
        }
        else {
            this.code = 404;
            this.data = [];
            this.status = false;
            this.message = 'Details not found!';
            return res.status(404).json(this.Response());
        }
    }
    async deleteAppConfig(req, res) {
        const id = req.params.id;
        const isValid = (0, index_1.isValidMongoDbObjectId)(id);
        if (isValid) {
            const deletedAppConfig = await (0, AppConfigModel_1.findByIdAndDeleteAppConfig)(id);
            if (!deletedAppConfig) {
                this.code = 404;
                this.status = false;
                this.data = [];
                this.message = 'Details not found!';
                return res.status(404).json(this.Response());
            }
            this.code = 204;
            this.data = [];
            this.status = true;
            this.message = 'Deleted From AppConfig';
            return res.status(200).json(this.Response());
        }
        else {
            this.code = 404;
            this.data = [];
            this.status = false;
            this.message = 'Details not found!';
            return res.status(404).json(this.Response());
        }
    }
    async getAppConfigById(req, res) {
        const id = req.params.id;
        const isValid = (0, index_1.isValidMongoDbObjectId)(id);
        if (isValid) {
            const foundDetailsOfAppConfig = await (0, AppConfigModel_1.getByIdAppConfig)(id);
            if (!foundDetailsOfAppConfig) {
                this.code = 404;
                this.status = false;
                this.message = 'Details not found!';
                return res.status(404).json(this.Response());
            }
            this.code = 200;
            this.data = foundDetailsOfAppConfig;
            this.status = true;
            this.message = 'Found Details';
            return res.status(200).json(this.Response());
        }
        else {
            this.code = 404;
            this.data = [];
            this.status = false;
            this.message = 'Details not found!';
            return res.status(404).json(this.Response());
        }
    }
}
exports.default = AppConfigController;
//# sourceMappingURL=AppConfigControllers.js.map