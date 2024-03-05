import {model , Schema} from 'mongoose';
import GupShupTicketReplyTypes from '../types/GupShupTicketReply'
const GupShupTicketTypeModel : Schema = new Schema({
    id: {
        type: String,
        required: false
      },
      phone: {
        type: String,
        required: false
      },
      details: {
        type: String,
        required: false
      },
      status: {
        type: String,
        required: false
      },
      ticket_id: {
        type: String,
        required: false
      },    
      tkt_obj_id: {
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'tickets_list',
      },
      cityHead: {
        type: String,
        required: false
      },
})

export default model<GupShupTicketReplyTypes>('ticket_reply', GupShupTicketTypeModel )