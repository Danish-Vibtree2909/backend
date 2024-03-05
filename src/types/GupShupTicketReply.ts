import {Document} from 'mongoose';

export default interface GupShupTicketReplyTypes extends Document {
    id : string;
    phone : string;
    details: string;
    status : string;
    ticket_id : string;
    tkt_obj_id : any;
    cityHead : string;
}