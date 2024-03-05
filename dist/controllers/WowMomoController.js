"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const wowMomo_1 = require("../helper/wowMomo");
class WowMomoController extends Index_1.default {
    constructor(model) {
        super(model);
        this.SendFeedBackToWowoMomo = this.SendFeedBackToWowoMomo.bind(this);
    }
    async SendFeedBackToWowoMomo(req, res) {
        const body = req.body;
        try {
            const response = await (0, wowMomo_1.sendFeedbackFormData)(body);
            this.data = JSON.parse(response);
            this.code = 200;
            this.message = 'Request complete';
            this.status = true;
            return res.status(200).json(this.Response());
        }
        catch (error) {
            this.data = [];
            this.code = 404;
            this.message = 'Something went wrong!';
            this.status = false;
            return res.status(404).json(this.Response());
        }
    }
}
exports.default = WowMomoController;
//# sourceMappingURL=WowMomoController.js.map