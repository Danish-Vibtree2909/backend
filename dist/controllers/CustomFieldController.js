"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const customFieldModel_1 = require("../services/customFieldModel");
class CustomeField extends Index_1.default {
    constructor(models) {
        super(models);
        this.getAllCustomField = this.getAllCustomField.bind(this);
        this.createCustomField = this.createCustomField.bind(this);
        this.checkIfKeyIsAlreadyExist = this.checkIfKeyIsAlreadyExist.bind(this);
        this.updateCustomField = this.updateCustomField.bind(this);
        this.deleteCustomField = this.deleteCustomField.bind(this);
        this.getCustomFieldById = this.getCustomFieldById.bind(this);
    }
    async getCustomFieldById(req, res) {
        const response = await (0, customFieldModel_1.findByIdCustomField)(req.params.id);
        if (response) {
            this.data = response;
            this.code = 200;
            this.message = 'Detail fetched!';
            this.status = true;
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
    async deleteCustomField(req, res) {
        const response = await (0, customFieldModel_1.findByIdAndDeleteCustomField)(req.params.id);
        if (response) {
            this.data = [];
            this.status = true;
            this.message = "Custom Field deleted!";
            this.code = 200;
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = "Something went wrong!";
            this.code = 404;
            return res.status(404).json(this.Response());
        }
    }
    async checkIfKeyIsAlreadyExist(req, res) {
        const keyName = req.query.keyName;
        if (!keyName) {
            this.data = [];
            this.status = false;
            this.message = "Please Provide a keyName in query";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const AccountSid = req.JWTUser?.authId;
        const query = { AccountSid: AccountSid, key: keyName };
        const isKeyAlreadyPresentInDb = await (0, customFieldModel_1.findOneCustomeVariable)(query);
        if (isKeyAlreadyPresentInDb) {
            this.data = [];
            this.status = true;
            this.message = "Key Is Already Present";
            this.code = 200;
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = "Key Is Not Present";
            this.code = 404;
            return res.status(404).json(this.Response());
        }
    }
    async getAllCustomField(req, res) {
        const authId = req.JWTUser?.authId;
        const queryParams = { ...req.query, AccountSid: authId };
        const salesActivityData = await (0, customFieldModel_1.getAllCustomField)(queryParams);
        const total = await (0, customFieldModel_1.countCustomField)(queryParams);
        const data = {
            totalCount: total,
            data: salesActivityData,
        };
        this.data = data;
        this.status = true;
        this.message = "Successfully fetched all";
        return res.json(this.Response());
    }
    checkIfKeyIsThereInPayloadOrNot = (data) => {
        let result = true;
        if (data.key === undefined) {
            result = false;
        }
        else if (data.key === null) {
            result = false;
        }
        else if (data.key === "") {
            result = false;
        }
        else {
            result = true;
        }
        return result;
    };
    async createCustomField(req, res) {
        const AccountSid = req.JWTUser?.authId;
        const userId = req.JWTUser?._id;
        const isKeyPresent = this.checkIfKeyIsThereInPayloadOrNot(req.body);
        console.log("Is Key Present :", isKeyPresent);
        if (isKeyPresent) {
            const keyName = req.body.key;
            const query = { AccountSid: AccountSid, key: keyName };
            const isKeyAlreadyPresentInDb = await (0, customFieldModel_1.findOneCustomeVariable)(query);
            console.log("isKeyAlreadyPresentInDb : ", isKeyAlreadyPresentInDb);
            if (isKeyAlreadyPresentInDb) {
                this.data = [];
                this.status = false;
                this.message = "Key Is Already Present";
                this.code = 404;
                return res.status(404).json(this.Response());
            }
        }
        const salesActivityData = await (0, customFieldModel_1.createCustomField)({
            ...req.body,
            AccountSid: AccountSid,
            user_id: userId,
        });
        this.data = salesActivityData;
        this.status = true;
        this.message = "Successfully created";
        this.code = 201;
        return res.status(201).json(this.Response());
    }
    async updateCustomField(req, res) {
        const response = await (0, customFieldModel_1.findByIdAndUpdateCustomField)(req.params.id, req.body, { upsert: false });
        if (response) {
            this.data = [];
            this.status = true;
            this.message = "Custom Field updated!";
            this.code = 204;
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = "Something went wrong!";
            this.code = 404;
            return res.status(404).json(this.Response());
        }
    }
}
exports.default = CustomeField;
//# sourceMappingURL=CustomFieldController.js.map