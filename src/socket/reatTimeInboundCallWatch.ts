import {ChangeStream , ChangeStreamOptions} from "mongodb";
import IvrStudiousTypes from "../types/IvrStudiousTypesRealTime";
import IvrStudiousRealTimeModel from "../models/IvrStudiousRealTime";

export function watchRealTimeIvrStudiousCollectionForInboundCalls(config: ChangeStreamOptions, callback: (stats: any, receiver: string) => void) {

    const ivrStudiousRealTimeWatcher = IvrStudiousRealTimeModel.watch(null!, config) as ChangeStream<IvrStudiousTypes>;
 
    ivrStudiousRealTimeWatcher.on('change', async (change: any)=>{
        const document : any = change.fullDocument as IvrStudiousTypes;
     
        if (!document) {
            return;
        }
        const records = await IvrStudiousRealTimeModel.find({Receiver : document.Receiver}) as any[];
     
        callback(records, document.Receiver);
    })
}