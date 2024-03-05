import { Schema, model } from 'mongoose'
import IContactCustomField from '../types/ContactsCustomField'
const mongoose = require("mongoose");

const ContactsCustomField : Schema = new Schema({
    name : {
        type: String,
        required: false,
    },
    value : {
        type: Schema.Types.Mixed,
        required: false,
    },
    type : {
        type: String,
        required: false,
    },
    selected_value : {
        type: Schema.Types.Mixed,
        required: false,
    },
    AccountSid : {
        type: String,
        required: false,
    },
    modules :{
        type: Schema.Types.Mixed,
        required: false,
    },
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
    key :{
        type : String,
        required : false
    }
})

export default model<IContactCustomField>('contact_custom_field', ContactsCustomField)
