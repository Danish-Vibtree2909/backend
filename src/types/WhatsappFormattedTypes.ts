import {Document} from 'mongoose';

export default interface WhatsappRecordFormatted extends Document {
    WaSid : string;
    origin : {
        type : {
            type : string,
            required : false,
        },
    },
    From : string;
    PhoneNumberId : string;
    WabId : string;
    To : string;
    status ? : [{
        sent : string,
        delivered : string,
        read : string,
        failed : string,
    }],
    pricing? : {
        billable : boolean,
        pricing_model : string,
        category : string,
    },
    templateName : string;
    messageType : string;
    contactName : string;
    Direction : string;
    timestamp : string;
}