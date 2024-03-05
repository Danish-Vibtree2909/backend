"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchRealTimeIvrStudiousCollectionForInboundCalls = void 0;
const IvrStudiousRealTime_1 = __importDefault(require("../models/IvrStudiousRealTime"));
function watchRealTimeIvrStudiousCollectionForInboundCalls(config, callback) {
    const ivrStudiousRealTimeWatcher = IvrStudiousRealTime_1.default.watch(null, config);
    ivrStudiousRealTimeWatcher.on('change', async (change) => {
        const document = change.fullDocument;
        if (!document) {
            return;
        }
        const records = await IvrStudiousRealTime_1.default.find({ Receiver: document.Receiver });
        callback(records, document.Receiver);
    });
}
exports.watchRealTimeIvrStudiousCollectionForInboundCalls = watchRealTimeIvrStudiousCollectionForInboundCalls;
//# sourceMappingURL=reatTimeInboundCallWatch.js.map