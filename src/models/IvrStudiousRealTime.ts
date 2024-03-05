import {model , Schema} from 'mongoose';
import ivrStudiousTypesRealTime from '../types/IvrStudiousTypesRealTime';


const IvrStudiousRealTime : Schema = new Schema({



    //Cloud phone RealTime 

    // AccountId :{
    //     type : String,
    //     required : true
    // },
    AccountSecretId : {
        type : String,
        required : false
    },
    ConferenceSid: {
        type: String,
        required: false
    },
    ConferenceSidTransfer:{
        type: String,
        required: false
    },
    FriendlyName: {
        type: String,
        required: false
    },
    Source :{
        type : String,
        required : false
    },
    userID :{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    transferFrom :{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    ParentCallId:{
        type : String,
        required : false
    },
    ParentCallIdTransferCall : {
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
    ListOfTransferredCalls : [
        {
            type: String,
            required : false
        }
    ],
    CustomerCallId:{
        type : String,
        required : false
    },
    ChildCallId:{
        type : String,
        required : false
    },
    Type:{
        type : String,
        required : false
    },
    TransferType :{
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

    AccountSid :{
        type : String,
        required : false
    },
    source :{
        type : String,
        required : false
    },
    // ConferenceSid : {
    //     type : String,
    //     required : false
    // },
    // FriendlyName:{
    //     type : String,
    //     required : false
    // },
    StatusCallbackEvent :{
        type : String,
        required : false
    },
    CallSidOfConferenceChildCall : {
        type : String,
        required : false
    },
    priority :{
        type : Number,
        required : false
    },
    // Receiver : {
    //     type : String,
    //     required : false
    // },
    DialCallStatus :{
        type : String,
        required : false
    },
    DialCallSid :{
        type : String,
        required : false
    },
    DialCallDuration :{
        type : String,
        required : false
    },
    Digits :{
        type : String,
        required : false
    },
    DtmfInputType:{
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
    // CallStatus:{
    //     type : String,
    //     required : false
    // },
    CallbackSource: {
        type : String,
        required : false
    },
    Called:{
        type : String,
        required : false
    },
    // Caller :{
    //     type : String,
    //     required : false
    // },
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
    variables : [{
        key :{
            type : String,
            required : false
        },
        value :{
            type : String,
            required : false
        }
    }],
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
    subscribeDate :{
        type : Date,
        required : true,
        default : Date.now
    },
    expireDate :{
        type : Date,
        required : false,
        // default : moment().add(3,'d').toDate() // data will automically delete after 3 days
    }
})

IvrStudiousRealTime.index({ expireDate: 1 }, { expireAfterSeconds: 0 });

export default model<ivrStudiousTypesRealTime>('realtime_ivrstudio',IvrStudiousRealTime);