import { model, Schema } from 'mongoose'
import AllRecordsModelInterface from '../types/allRecords'

const AllRecordsModel : Schema = new Schema({


    AccountSid :{
        type : String,
        required : false
    },
    AnswerTime : {
        type : String,
        required : false
    },
    CampaignId : {
        type : String,
        required : false
    },
    TargetId : {
        type : String,
        required : false
    },
    ApiVersion:{
        type : String,
        required : false
    },
    CallDuration :{
        type : String,
        required : false
    },
    CallSid:{
        type : String,
        required : false
    },
    CallStatus:{
        type : String,
        required : false
    },
    CallbackSource: {
        type : String,
        required : false
    },
    Called:{
        type : String,
        required : false
    },
    Caller :{
        type : String,
        required : false
    },
    Direction :{
        type : String,
        required : false
    },
    From: {
        type : String,
        required : false
    },
    HangupTime :{
        type : String,
        required : false
    },
    InitiationTime:{
        type : String,
        required : false
    },
    ParentCallSid:{
        type : String,
        required : false
    },
    RecordingUrl :{
        type : String,
        required : false
    },
    RingTime: {
        type : String,
        required : false
    },
    SequenceNumber :{
        type : String,
        required : false
    },
    TimeStamp :{
        type : String,
        required : false
    },
    To :{
        type : String,
        required : false
    },
    subscribeDate :{
        type : Date,
        required : true,
        default : Date.now
    },
})

export default model<AllRecordsModelInterface>('allRecords', AllRecordsModel)
