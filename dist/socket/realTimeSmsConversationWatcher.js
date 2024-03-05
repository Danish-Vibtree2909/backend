"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchRealtimeSmsConversationCollection = void 0;
const SMSConversationModel_1 = __importDefault(require("../models/SMSConversationModel"));
function watchRealtimeSmsConversationCollection(config, callback) {
    const smsConversationRealTime = SMSConversationModel_1.default.watch(null, config);
    smsConversationRealTime.on('change', async (change) => {
        const document = change.fullDocument;
        // console.log("change : ",change.fullDocument)
        if (!document) {
            return;
        }
        const cloudNumber = document.cloudNumber;
        const data = { change: document, account: cloudNumber };
        callback(data, cloudNumber);
    });
}
exports.watchRealtimeSmsConversationCollection = watchRealtimeSmsConversationCollection;
//# sourceMappingURL=realTimeSmsConversationWatcher.js.map