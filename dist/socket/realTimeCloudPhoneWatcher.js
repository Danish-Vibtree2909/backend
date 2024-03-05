"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchRealTimeCloudPhoneCollection = void 0;
const CloudPhoneRealTimeModel_1 = __importDefault(require("../models/CloudPhoneRealTimeModel"));
function watchRealTimeCloudPhoneCollection(config, callback) {
    const CloudPhoneRealTimeWatcher = CloudPhoneRealTimeModel_1.default.watch(null, config);
    CloudPhoneRealTimeWatcher.on('change', async (change) => {
        const document = change.fullDocument;
        if (!document) {
            return;
        }
        const records = await CloudPhoneRealTimeModel_1.default.find({ AccountId: document.AccountId });
        callback(records, document.AccountId);
    });
}
exports.watchRealTimeCloudPhoneCollection = watchRealTimeCloudPhoneCollection;
//# sourceMappingURL=realTimeCloudPhoneWatcher.js.map