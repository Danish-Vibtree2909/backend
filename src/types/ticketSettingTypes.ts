import {Document} from 'mongoose';

export default interface TicketSettingsTypes extends Document {
    AccountSid : string;
    ticket_status : {
        name : string;
        color_code :  string;
    },
    ticket_prefix : string;
    ticket_last_created : string;
}