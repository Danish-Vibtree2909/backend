"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCollectionWatch = void 0;
const callRecordWatcher_1 = require("./callRecordWatcher");
const realTimeCloudPhoneWatcher_1 = require("./realTimeCloudPhoneWatcher");
const realTimeIvrStudiousWatcher_1 = require("./realTimeIvrStudiousWatcher");
const reatTimeInboundCallWatch_1 = require("./reatTimeInboundCallWatch");
const realTimeSmsConversationWatcher_1 = require("./realTimeSmsConversationWatcher");
const logger_1 = __importDefault(require("../config/logger"));
function setupCollectionWatch(client, socketServer) {
    const watchConfig = {
        fullDocument: "updateLookup"
    };
    (0, callRecordWatcher_1.watchAllCallCollection)(watchConfig, handleCallStat);
    (0, realTimeCloudPhoneWatcher_1.watchRealTimeCloudPhoneCollection)(watchConfig, handleRealtimeCloudPhoneCallback);
    (0, realTimeIvrStudiousWatcher_1.watchRealTimeIvrStudiousCollection)(watchConfig, handleRealtimeIvrStudiousCallback);
    (0, reatTimeInboundCallWatch_1.watchRealTimeIvrStudiousCollectionForInboundCalls)(watchConfig, handleRealtimeIvrStudiousCallbackForInBoundCalls);
    (0, realTimeSmsConversationWatcher_1.watchRealtimeSmsConversationCollection)(watchConfig, handleRealtimeSmsConversation);
    function handleRealtimeSmsConversation(sms, cloudNumber) {
        // console.log("sms conversation : ", cloudNumber , sms)
        socketServer.of('/sms').to(`conversations_${cloudNumber}`).emit('conversation', sms);
    }
    function handleRealtimeIvrStudiousCallbackForInBoundCalls(call, account) {
        // console.log("account : ", account , call)
        socketServer.of('/inbound').in(`inbound_${account}`).emit('realtime_inbound', call);
    }
    function handleRealtimeIvrStudiousCallback(call, account) {
        socketServer.of('/stats').in(`dashboard_${account}`).emit('realtime_ivrStudious', call);
    }
    function handleRealtimeCloudPhoneCallback(call, account) {
        socketServer.of('/stats').in(`dashboard_${account}`).emit('realtime_cloudPhone', call);
    }
    function handleCallStat(stats, account, source) {
        const data = {
            source: source,
            current: stats,
            previous: [],
        };
        logger_1.default.info('live_widget_data' + JSON.stringify(data));
        console.debug('live_widget_data', data);
        socketServer.of('/stats').in(`dashboard_${account}`).emit('live_widget_data', data);
    }
}
exports.setupCollectionWatch = setupCollectionWatch;
//# sourceMappingURL=socketService.js.map