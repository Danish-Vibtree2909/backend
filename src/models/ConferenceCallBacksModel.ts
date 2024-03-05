import { Schema , model } from "mongoose";
import  IConferenceCallBacks  from "../types/ConferenceCallBacksTypes";

const ConferenceCallBacksSchema = new Schema({
    AccountSid : {
        type: String,
        required: false
    },
    ConferenceSid: {
        type: String,
        required: false
    },
    FriendlyName: {
        type: String,
        required: false
    },
    StatusCallbackEvent: {
        type: String,
        required: false
    },
    Timestamp : {
        type: String,
        required: false
    },
    CallSid : {
        type: String,
        required: false
    },
    EndConferenceOnExit : {
        type: String,
        required: false
    },
    Hold : {
        type: String,
        required: false
    },
    Muted : {
        type: String,
        required: false
    },
    SequenceNumber : {
        type: String,
        required: false
    },
    StartConferenceOnEnter : {
        type: String,
        required: false
    },
    expireAt: {
        type: Date,
        required: false
    },

});
ConferenceCallBacksSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default model<IConferenceCallBacks>("ConferenceCallBacks",ConferenceCallBacksSchema);