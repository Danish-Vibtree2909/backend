"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchAllCallCollection = void 0;
const CallStatsService_1 = require("../services/CallStatService/CallStatsService");
const dateHelper_1 = require("../helper/dateHelper");
const CloudPhoneModel_1 = __importDefault(require("../models/CloudPhoneModel"));
const ivrFlowModel_1 = __importDefault(require("../models/ivrFlowModel"));
function watchAllCallCollection(config, callback) {
    const cloudPhoneChangeStream = CloudPhoneModel_1.default.watch(null, config);
    const ivrFlowChangeStream = ivrFlowModel_1.default.watch(null, config);
    const todayDate = (0, dateHelper_1.today)();
    cloudPhoneChangeStream.on("change", async (change) => {
        const document = change.fullDocument;
        if (!document) {
            return;
        }
        const stats = await (0, CallStatsService_1.getStatForAccount)({
            auth_id: document.AccountId,
            callSource: 'CloudPhone',
            timeFrame: "Custom",
            startDate: todayDate,
            endDate: todayDate,
        });
        callback(stats, document.AccountId, 'CloudPhone');
    });
    ivrFlowChangeStream.on("change", async (change) => {
        const document = change.fullDocument;
        if (!document) {
            return;
        }
        const stats = await (0, CallStatsService_1.getStatForAccount)({
            auth_id: document.AccountSid,
            callSource: 'IvrFlow',
            timeFrame: "Custom",
            startDate: todayDate,
            endDate: todayDate,
        });
        callback(stats, document.AccountSid, 'IvrFlow');
    });
}
exports.watchAllCallCollection = watchAllCallCollection;
//# sourceMappingURL=callRecordWatcher.js.map