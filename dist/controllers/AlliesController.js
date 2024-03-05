"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const AlliesModel_1 = require("../services/AlliesModel");
const index_1 = require("../helper/index");
class BlocklistController extends Index_1.default {
    constructor(model) {
        super(model);
        this.getAllies = this.getAllies.bind(this);
        this.createAllies = this.createAllies.bind(this);
        this.updateAllies = this.updateAllies.bind(this);
        this.deleteAllies = this.deleteAllies.bind(this);
        this.getAlliesById = this.getAlliesById.bind(this);
    }
    async getAllies(req, res) {
        const authId = req.JWTUser?.authId;
        const queryParams = { ...req.query, authId: authId };
        const blocklists = await (0, AlliesModel_1.getAllAllies)(queryParams);
        const total = await (0, AlliesModel_1.countDocumentAllies)(queryParams);
        const data = {
            totalCount: total,
            data: blocklists,
        };
        this.data = data;
        this.status = true;
        this.message = "Fetched Blocklists";
        this.code = 200;
        return res.status(200).json(this.Response());
    }
    async createAllies(req, res) {
        const body = { ...req.body };
        if (!body.partner) {
            this.data = [];
            this.status = false;
            this.message = "Missing parameter partner";
            this.code = 403;
            return res.status(201).json(this.Response());
        }
        const createdBlocklist = await (0, AlliesModel_1.createAllies)(body);
        this.data = createdBlocklist;
        this.status = true;
        this.message = "Added to Allies";
        this.code = 201;
        return res.status(201).json(this.Response());
    }
    async updateAllies(req, res) {
        const query = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(query);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const updates = req.body;
        const options = { upsert: false };
        const updatedBlockList = await (0, AlliesModel_1.findByIdAndUpdateAllies)(query, updates, options);
        if (updatedBlockList) {
            this.data = [];
            this.status = true;
            this.message = "Updated  Allies";
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
    async deleteAllies(req, res) {
        const id = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const deletedBlockList = await (0, AlliesModel_1.findByIdAndDeleteAllies)(id);
        if (deletedBlockList) {
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
    async getAlliesById(req, res) {
        const id = req.params.id;
        const query = { ...req.query };
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const foundDetailsOfBlockList = await (0, AlliesModel_1.getByIdAllies)(id, query);
        if (foundDetailsOfBlockList) {
            this.data = foundDetailsOfBlockList;
            this.status = true;
            this.code = 200;
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
}
exports.default = BlocklistController;
//# sourceMappingURL=AlliesController.js.map