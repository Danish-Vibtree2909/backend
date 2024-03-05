"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const PlanModel_1 = require("../services/PlanModel");
class PlanController extends Index_1.default {
    constructor(model) {
        super(model);
        this.getAllPlans = this.getAllPlans.bind(this);
        this.creatPlan = this.creatPlan.bind(this);
        this.getPlanById = this.getPlanById.bind(this);
        this.updatePlan = this.updatePlan.bind(this);
    }
    async updatePlan(req, res) {
        const id = req.params.id;
        const updates = { ...req.body };
        const option = { upsert: false };
        const response = await (0, PlanModel_1.findByIdAndUpdatePlan)(id, updates, option);
        if (response) {
            this.data = [];
            this.code = 204;
            this.status = true;
            this.message = "Details updated!";
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.code = 404;
            this.status = false;
            this.message = "Something went wrong!";
            return res.status(404).json(this.Response());
        }
    }
    async getPlanById(req, res) {
        const id = req.params.id;
        const response = await (0, PlanModel_1.getByIdPlan)(id);
        this.data = response;
        this.code = 200;
        this.message = "Details fetched ID";
        this.status = true;
        return res.status(200).json(this.Response());
    }
    async getAllPlans(req, res) {
        const query = { ...req.query };
        const data = await (0, PlanModel_1.getAllPlans)(query);
        const count = await (0, PlanModel_1.countDocumentOfPlan)(query);
        this.data = {
            data: data,
            count: count,
        };
        this.status = true;
        this.message = "Plans Fetched!";
        this.code = 200;
        return res.status(200).json(this.Response());
    }
    async creatPlan(req, res) {
        const data = { ...req.body };
        const createdPlan = await (0, PlanModel_1.createPlan)(data);
        if (createdPlan) {
            this.data = [];
            this.code = 201;
            this.message = "Plan created!";
            this.status = true;
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
}
exports.default = PlanController;
//# sourceMappingURL=PlanController.js.map