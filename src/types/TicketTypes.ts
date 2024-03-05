import {Document} from 'mongoose';

export default interface TicketTypes extends Document {
    AccountSid : string;
    user_id : any;
    ticket_id: any;
    ticket_details : string;
    status : any;
    created_by : any;
    created_at : any;
    conversation : any;
    CustomVariables : [{
        name : string;
        value : any;
        type : string;
        selected_value : string;
    }];
    TimeLine :[{
        text: string;
        created_by : string;
        updated_by? : any
    }],
    TicketFor : string;
    ParentCallSid : string;
    contact_name? : string;
    contact_number? : string;
    admin_number?: string;
}