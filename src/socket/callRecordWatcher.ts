import {ChangeStreamOptions} from "mongodb";
import CloudPhoneTypes from "../types/CloudPhoneType";
import { ChangeStream } from 'mongodb'
import {CallSource, getStatForAccount} from "../services/CallStatService/CallStatsService";
import {CallStatSummary} from "../services/CallStatService";
import {today} from "../helper/dateHelper";
import CloudPhoneModel from "../models/CloudPhoneModel";
import IvrFlowModel from "../models/ivrFlowModel";

export function watchAllCallCollection(config: ChangeStreamOptions, callback: (stats: CallStatSummary[], account: string, source: CallSource) => void){
    const cloudPhoneChangeStream = CloudPhoneModel.watch(null!, config) as ChangeStream<CloudPhoneTypes>;
    const ivrFlowChangeStream = IvrFlowModel.watch(null!, config) as ChangeStream<any>;

    const todayDate = today();

    cloudPhoneChangeStream.on("change", async (change: any) => {
        const document = change.fullDocument as CloudPhoneTypes;

        if (!document) {
            return;
        }

        const stats = await getStatForAccount({
            auth_id: document.AccountId,
            callSource: 'CloudPhone',
            timeFrame: "Custom",
            startDate: todayDate,
            endDate: todayDate,
        })

        callback(stats, document.AccountId, 'CloudPhone');
    });

    ivrFlowChangeStream.on("change", async (change: any) => {
        const document = change.fullDocument as any;

        if (!document) {
            return;
        }

        const stats = await getStatForAccount({
            auth_id: document.AccountSid,
            callSource: 'IvrFlow',
            timeFrame: "Custom",
            startDate: todayDate,
            endDate: todayDate,
        })

        callback(stats, document.AccountSid, 'IvrFlow');
    })


}