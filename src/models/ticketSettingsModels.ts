import {model , Schema} from 'mongoose';
import TicketSettingsTypes from '../types/ticketSettingTypes';

const TicketSettingsModel = new Schema({
    AccountSid : {
        type : String,
        required : false
    },
    ticket_status : {
        type : Schema.Types.Mixed,
        required : false,
    },
    ticket_prefix : {
        type : String,
        required : false
    },
    ticket_last_created : {
        type : String,
        required : false
    },
    createdAt:{
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
    updatedAt:{
        type: Date,
        default:()=> Date.now(),
    },
})

export default model<TicketSettingsTypes>('ticket_settings',TicketSettingsModel);