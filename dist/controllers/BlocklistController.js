"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const BlockListModel_1 = require("../services/BlockListModel");
const index_1 = require("../helper/index");
class BlocklistController extends Index_1.default {
    constructor(model) {
        super(model);
        this.getBlockList = this.getBlockList.bind(this);
        this.createBlockList = this.createBlockList.bind(this);
        this.updateBlockList = this.updateBlockList.bind(this);
        this.deleteBlocklist = this.deleteBlocklist.bind(this);
        this.getBlockListById = this.getBlockListById.bind(this);
    }
    async getBlockList(req, res) {
        const authId = req.JWTUser?.authId;
        const queryParams = { ...req.query, authId: authId };
        const blocklists = await (0, BlockListModel_1.getAllBlockList)(queryParams);
        const total = await (0, BlockListModel_1.countDocumentBlockList)(queryParams);
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
    async createBlockList(req, res) {
        const authId = req.JWTUser?.authId;
        const body = { ...req.body, authId: authId };
        const createdBlocklist = await (0, BlockListModel_1.createBlockList)(body);
        this.data = createdBlocklist;
        this.status = true;
        this.message = "Added to Blocklist";
        this.code = 201;
        return res.status(201).json(this.Response());
    }
    async updateBlockList(req, res) {
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
        const updatedBlockList = await (0, BlockListModel_1.findByIdAndUpdateBlockList)(query, updates, options);
        if (updatedBlockList) {
            this.data = [];
            this.status = true;
            this.message = "Updated  Blocklist";
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
    async deleteBlocklist(req, res) {
        const id = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const deletedBlockList = await (0, BlockListModel_1.findByIdAndDeleteBlocklist)(id);
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
    async getBlockListById(req, res) {
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
        const foundDetailsOfBlockList = await (0, BlockListModel_1.getByIdBlocklist)(id, query);
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
//# sourceMappingURL=BlocklistController.js.map