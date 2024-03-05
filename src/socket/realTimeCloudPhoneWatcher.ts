import {ChangeStream, ChangeStreamOptions} from "mongodb";
import CloudPhoneTypes from "../types/CloudPhoneType";
import CloudPhoneRealTimeModel from "../models/CloudPhoneRealTimeModel";

export function watchRealTimeCloudPhoneCollection(config: ChangeStreamOptions, callback: (stats: any, account: string) => void) {
    const CloudPhoneRealTimeWatcher = CloudPhoneRealTimeModel.watch(null!, config) as ChangeStream<CloudPhoneTypes>;

    CloudPhoneRealTimeWatcher.on('change', async (change: any)=>{
        const document = change.fullDocument as CloudPhoneTypes;
    
        if (!document) {
            return;
        }
        const records = await CloudPhoneRealTimeModel.find({AccountId : document.AccountId}) as any[];
      
        callback(records, document.AccountId);
    })
}