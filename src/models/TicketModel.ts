import { model , Schema } from "mongoose";
import TicketInterface from "../types/ticketType";

const TicketModel : Schema = new Schema({
  subject: {
    type: String,
    required: false
  },
  customer: {
    type: String,
    required: false
  },
  // project: {
  //   type: String,
  //   required: false
  // },
  application: {
    type: String,
    required: false
  },
  assigned_to: {
    type: String,
    required: false
  },
  assigned_user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  ticket_id: {
    type: String,
    required: false
  },
  messages: {
    type: Schema.Types.Array,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  published_at: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    required: false
  },
  updatedAt: {
    type: Date,
    required: false
  },
  attachments: {
    type: String,
    required: false
  }
});

export default model<TicketInterface>('tickets', TicketModel);
