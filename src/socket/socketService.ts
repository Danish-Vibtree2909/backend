import * as Mongoose from "mongoose";
import {ChangeStreamOptions} from "mongodb";
import {watchAllCallCollection} from "./callRecordWatcher";
import {CallStatSummary} from "../services/CallStatService";
import { Server } from 'socket.io';
import {CallSource} from "../services/CallStatService/CallStatsService";
import {watchRealTimeCloudPhoneCollection} from "./realTimeCloudPhoneWatcher";
import {watchRealTimeIvrStudiousCollection} from "./realTimeIvrStudiousWatcher";
import { watchRealTimeIvrStudiousCollectionForInboundCalls } from "./reatTimeInboundCallWatch";
import { watchRealtimeSmsConversationCollection } from "./realTimeSmsConversationWatcher";
import logger from '../config/logger'

export function setupCollectionWatch(client: Mongoose.Mongoose, socketServer: Server) {
    const watchConfig: ChangeStreamOptions = {
        fullDocument: "updateLookup"
    };

    watchAllCallCollection(watchConfig, handleCallStat);
    watchRealTimeCloudPhoneCollection(watchConfig, handleRealtimeCloudPhoneCallback);
    watchRealTimeIvrStudiousCollection(watchConfig, handleRealtimeIvrStudiousCallback);
    watchRealTimeIvrStudiousCollectionForInboundCalls(watchConfig , handleRealtimeIvrStudiousCallbackForInBoundCalls);
    watchRealtimeSmsConversationCollection( watchConfig , handleRealtimeSmsConversation);

    function handleRealtimeSmsConversation( sms : any , cloudNumber : any ){
        // console.log("sms conversation : ", cloudNumber , sms)
        socketServer.of('/sms').to(`conversations_${cloudNumber}`).emit('conversation' , sms)
    }

    function handleRealtimeIvrStudiousCallbackForInBoundCalls(call : any , account: string){
        // console.log("account : ", account , call)
        socketServer.of('/inbound').in(`inbound_${account}`).emit('realtime_inbound', call);
    }

    function handleRealtimeIvrStudiousCallback(call : any , account : string ){
        socketServer.of('/stats').in(`dashboard_${account}`).emit('realtime_ivrStudious', call);
    }

    function handleRealtimeCloudPhoneCallback(call : any , account : string ){
        socketServer.of('/stats').in(`dashboard_${account}`).emit('realtime_cloudPhone', call);
    }

    function handleCallStat(stats: CallStatSummary[], account: string, source: CallSource) {
        const data = {
            source: source,
            current: stats,
            previous: [],
        };
        logger.info('live_widget_data'+ JSON.stringify(data))
        console.debug('live_widget_data', data);
        socketServer.of('/stats').in(`dashboard_${account}`).emit('live_widget_data', data)
    }
}
