"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchRealTimeIvrStudiousCollection = void 0;
const IvrStudiousRealTime_1 = __importDefault(require("../models/IvrStudiousRealTime"));
function watchRealTimeIvrStudiousCollection(config, callback) {
    const ivrStudiousRealTimeWatcher = IvrStudiousRealTime_1.default.watch(null, config);
    ivrStudiousRealTimeWatcher.on('change', async (change) => {
        const document = change.fullDocument;
        if (!document) {
            return;
        }
        const records = await IvrStudiousRealTime_1.default.find({ AccountSid: document.AccountSid });
        callback(records, document.AccountSid);
    });
}
exports.watchRealTimeIvrStudiousCollection = watchRealTimeIvrStudiousCollection;
//# sourceMappingURL=realTimeIvrStudiousWatcher.js.map