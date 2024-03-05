import { model , Schema } from "mongoose";
import UserInvoiceInterface from "../types/userInvoiceType";

const UserInvoiceModel: Schema = new Schema({
  referenceId: {
    type: String,
    required: true,
    default: false,
  },
  invoiceId: {
    type: String,
    required: true,
    default: false,
  },
  invoiceUrl: {
    type: String,
    required: true,
    default: false,
  },
  mode: {
    type: String,
    required: true,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
});

export default model<UserInvoiceInterface>('user_invoices', UserInvoiceModel);
