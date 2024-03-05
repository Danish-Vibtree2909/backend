import { ChangeStream , ChangeStreamOptions} from 'mongodb';
import SMSConversationType from '../types/SMSConversationType';
import SMSConversationModel from '../models/SMSConversationModel';

export function watchRealtimeSmsConversationCollection ( config : ChangeStreamOptions , callback : ( stats : any , account : string)=> void ){
    const smsConversationRealTime = SMSConversationModel.watch( null! , config) as ChangeStream<SMSConversationType>

    smsConversationRealTime.on('change', async ( change : any)=>{
        const document = change.fullDocument as SMSConversationType;
        // console.log("change : ",change.fullDocument)
        if( !document ){
            return;
        }
        const cloudNumber = document.cloudNumber
        const data = { change : document , account : cloudNumber};
        callback( data , cloudNumber)
    })
}