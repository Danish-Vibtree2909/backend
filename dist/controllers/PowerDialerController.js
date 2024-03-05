"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const powerDialerModel_1 = require("../services/powerDialerModel");
const vibconnectModel_1 = require("../services/vibconnectModel");
const index_1 = require("../helper/index");
class PowerDialerController extends Index_1.default {
    constructor(models) {
        super(models);
        this.getPowerDialerVersionTwo = this.getPowerDialerVersionTwo.bind(this);
        this.getPowerDialerStatusVersionTwo = this.getPowerDialerStatusVersionTwo.bind(this);
        this.createPowerDialerVersionTwo = this.createPowerDialerVersionTwo.bind(this);
        this.updatePowerDialerVersionTwo = this.updatePowerDialerVersionTwo.bind(this);
        this.deletePowerDialerVersionTwo = this.deletePowerDialerVersionTwo.bind(this);
        this.deleteManyPowerDialerVersionTwo = this.deleteManyPowerDialerVersionTwo.bind(this);
        this.insertManyPowerDialerVersionTwo = this.insertManyPowerDialerVersionTwo.bind(this);
        this.getByIdPowerDialerVersionTwo = this.getByIdPowerDialerVersionTwo.bind(this);
    }
    async getByIdPowerDialerVersionTwo(req, res) {
        const query = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(query);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = 'Please check the id!';
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const foundDetailsOfBlockList = await (0, powerDialerModel_1.getPowerDialerDetailsById)(query);
        if (!foundDetailsOfBlockList) {
            this.data = [];
            this.code = 403;
            this.message = 'Please check the id!';
            this.status = false;
            return res.status(403).json(this.Response());
        }
        this.data = foundDetailsOfBlockList;
        this.status = true;
        this.message = 'Found Details';
        this.code = 200;
        return res.status(200).json(this.Response());
    }
    filterOnlyIdFromDocument = (data) => {
        let output = [];
        output = data.map((item) => {
            return item._id;
        });
        // console.log("output : ", output)
        return output;
    };
    async insertManyPowerDialerVersionTwo(req, res) {
        const arrayOfChildCalls = req.body;
        const data = await (0, powerDialerModel_1.insertManyPowerDialer)(arrayOfChildCalls);
        // console.log("Data : ", onlyIdsOdDocuments)
        if (data) {
            const onlyIdsOdDocuments = this.filterOnlyIdFromDocument(data);
            this.data = { "count": data.length, "data": onlyIdsOdDocuments };
            this.status = true;
            this.message = 'Successfully added the Power Dialer';
            this.code = 201;
            return res.status(201).json(this.Response());
        }
        this.data = [];
        this.status = false;
        this.message = 'Something went wrong!';
        this.code = 403;
        return res.status(403).json(this.Response());
    }
    async deleteManyPowerDialerVersionTwo(req, res) {
        const body = req.body;
        //console.log("Body : ", body)
        const responseAfterDeleting = await (0, powerDialerModel_1.deleteManyPowerDialer)({ ...body });
        if (!responseAfterDeleting) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = "Please check the query which you give in body!";
            return res.status(403).json(this.Response());
        }
        //console.log("Response : ", responseAfterDeleting)
        const response = {
            "data": responseAfterDeleting.deletedCount,
            "message": "Power Dialer Deleted!",
            "status": true,
            "code": 200
        };
        return res.status(200).json(response);
    }
    async deletePowerDialerVersionTwo(req, res) {
        const query = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(query);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = 'Please check the id';
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const updatedBlockList = await (0, powerDialerModel_1.findByIdAndDeletePowerDialer)(query);
        if (updatedBlockList) {
            this.data = [];
            this.status = true;
            this.message = 'Deleted Power Dialer';
            this.code = 204;
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = 'Please check the id!';
            this.code = 403;
            return res.status(403).json(this.Response());
        }
    }
    async updatePowerDialerVersionTwo(req, res) {
        const query = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(query);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = 'Please check the id!';
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const updates = req.body;
        const options = { upsert: false };
        const updatedBlockList = await (0, powerDialerModel_1.findByIdAndUpdatePowerDialer)(query, updates, options);
        if (updatedBlockList) {
            this.data = [];
            this.status = true;
            this.message = 'Updated Power Dialer';
            this.code = 204;
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.message = 'Please check the id!';
            this.code = 403;
            return res.status(403).json(this.Response());
        }
    }
    async createPowerDialerVersionTwo(req, res) {
        const companyId = req.JWTUser?.companyId ? req.JWTUser?.companyId : false;
        const userId = req.JWTUser?._id ? req.JWTUser?._id : false;
        const body = { ...req.body };
        if (!companyId) {
            this.status = false;
            this.code = 403;
            this.message = "User is not assigned to any company!";
            this.data = [];
            return res.status(403).json(this.Response());
        }
        if (!body.contactNumber) {
            this.status = false;
            this.code = 403;
            this.message = "Provide contactNumber!";
            this.data = [];
            return res.status(403).json(this.Response());
        }
        if (!body.contactId) {
            this.status = false;
            this.code = 403;
            this.message = "Provide contactId!";
            this.data = [];
            return res.status(403).json(this.Response());
        }
        const query = {
            companyId: companyId,
        };
        const vibDetails = await (0, vibconnectModel_1.getVibconnect)(query);
        const authId = vibDetails.length > 0 ? vibDetails[0].authId : false;
        const authSecret = vibDetails.length > 0 ? vibDetails[0].authSecret : false;
        const powerDialerObj = { ...body, authId: authId, authSecret: authSecret, userId: userId };
        const createdBlocklist = await (0, powerDialerModel_1.createPowerDialer)(powerDialerObj);
        this.data = createdBlocklist;
        this.status = true;
        this.message = "Added to PowerDialer";
        this.code = 201;
        return res.status(201).json(this.Response());
    }
    async getPowerDialerStatusVersionTwo(req, res) {
        const authId = req.JWTUser?.authId;
        const queryParams = { ...req.query };
        const finalQuery = { ...queryParams, authId: authId };
        const total = await (0, powerDialerModel_1.countDocumentPowerDialer)(finalQuery);
        const response = {
            data: total,
            status: true,
            code: 200,
            message: 'Count fetched!'
        };
        return res.status(200).json(response);
    }
    async getPowerDialerVersionTwo(req, res) {
        const authId = req.JWTUser?.authId;
        const queryParams = { ...req.query };
        const finalQuery = { ...queryParams, authId: authId };
        const pwData = await (0, powerDialerModel_1.getAllPowerDialer)(finalQuery);
        const total = await (0, powerDialerModel_1.countDocumentPowerDialer)(finalQuery);
        const data = {
            "totalCount": total,
            "data": pwData
        };
        this.data = data;
        this.status = true;
        this.message = 'Details Fetched';
        return res.json(this.Response());
    }
}
exports.default = PowerDialerController;
//# sourceMappingURL=PowerDialerController.js.map