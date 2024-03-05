"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const LeadModel_1 = require("../services/LeadModel");
class LeadController extends Index_1.default {
    constructor(model) {
        super(model);
        this.createLead = this.createLead.bind(this);
        this.deleteLead = this.deleteLead.bind(this);
    }
    async createLead(req, res) {
        const email = req.body.email;
        if (!email) {
            this.data = [];
            this.code = 403;
            this.status = false;
            this.message = "Provide email!";
            return res.status(201).json(this.Response());
        }
        const query = { email: email };
        const body = { ...req.body };
        const options = { upsert: true };
        const response = await (0, LeadModel_1.findOnendUpdateLead)(query, body, options);
        if (response) {
            this.data = response;
            this.status = true;
            this.code = 201;
            this.message = "Lead Created!";
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
    async deleteLead(req, res) {
        const email = req.body.email;
        const query = { email: email };
        const response = await (0, LeadModel_1.deleteManyLead)(query);
        if (response) {
            this.data = [];
            this.status = true;
            this.code = 200;
            this.message = "Lead Deleted!";
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
}
exports.default = LeadController;
//# sourceMappingURL=LeadController.js.map