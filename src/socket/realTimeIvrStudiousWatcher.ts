import {ChangeStream , ChangeStreamOptions} from "mongodb";
import IvrStudiousTypes from "../types/IvrStudiousTypesRealTime";
import IvrStudiousRealTimeModel from "../models/IvrStudiousRealTime";

export function watchRealTimeIvrStudiousCollection(config: ChangeStreamOptions, callback: (stats: any, account: string) => void) {
    const ivrStudiousRealTimeWatcher = IvrStudiousRealTimeModel.watch(null!, config) as ChangeStream<IvrStudiousTypes>;

    ivrStudiousRealTimeWatcher.on('change', async (change: any)=>{
        const document = change.fullDocument as IvrStudiousTypes;

        if (!document) {
            return;
        }
        const records = await IvrStudiousRealTimeModel.find({AccountSid : document.AccountSid}) as any[];

        callback(records, document.AccountSid);
    })
}