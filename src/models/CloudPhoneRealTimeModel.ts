import { model, Schema } from 'mongoose'
// import AllRecordsModelInterface from '../types/allRecords'
import CloudPhoneModelInterface from '../types/CloudPhoneType'

const CloudPhoneRealTimeModel : Schema = new Schema({
    AccountId :{
        type : String,
        required : true
    },
    AccountSecretId : {
        type : String,
        required : false
    },
    ConferenceSid: {
        type: String,
        required: false
    },
    FriendlyName: {
        type: String,
        required: false
    },
    Tags: [{
        name: {
          type: String,
          required: false,
          trim: true,

        },
        checked: {
          type: Boolean,
          default: false,
          required: false
        },
        backgroundColor: {
            type: String,
            default: '#FFE5B4',
            required: false
        }
      }],
    Notes: [
    {
        value : {
            type: String,
            required: false,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            required: true
        },
        name : {
            type: String,
            required: false,
        }
    }
    ],
    Source :{
        type : String,
        required : false
    },
    userID :{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    ParentCallId:{
        type : String,
        required : false
    },
    ConferenceStatus:{
        type : String,
        required : false
    },
    ConferenceTimeStampArray : [
        {
            type: Schema.Types.Mixed,
            required : false
        }
    ],
    ChildCallId:{
        type : String,
        required : false
    },
    CallType :{
        type : String,
        required : false
    },
    CloudNumber :{
        type : String,
        required : false
    },
    CallUsing :{
        type : String,
        required : false
    },
    User :{
        type : String,
        required : false
    },
    UserType :{
        type : String,
        required : false
    },
    Caller :{
        type : String,
        required : false
    },
    Receiver :{
        type : String,
        required : false
    },
    StartTime:{
        type : String,
        required : false
    },
    Recording :{
        type : String,
        required : false
    },
    Duration :{
        type : String,
        required : false
    },
    CallStatus:{
        type : String,
        required : false
    },
    CC_intiated:{
        type : String,
        required: false
    },
    CC_ringing:{
        type : String,
        required: false
    },
    CC_in_progress:{
        type : String,
        required: false
    },
    CC_completed:{
        type : String,
        required: false
    },
    CC_busy:{
        type : String,
        required: false
    },
    CC_failed:{
        type : String,
        required: false
    },
    CC_canceled:{
        type : String,
        required: false
    },
    PC_intiated:{
        type : String,
        required: false
    },
    PC_ringing:{
        type : String,
        required: false
    },
    PC_in_progress:{
        type : String,
        required: false
    },
    PC_completed:{
        type : String,
        required: false
    },
    PC_busy:{
        type : String,
        required: false
    },
    PC_failed:{
        type : String,
        required: false
    },
    PC_canceled:{
        type : String,
        required: false
    },
    subscribeDate :{
        type : Date,
        required : true,
        default : Date.now
    },
})

export default model<CloudPhoneModelInterface>('realtime_cloudphones', CloudPhoneRealTimeModel)
