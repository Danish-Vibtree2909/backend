import { model, Schema } from 'mongoose'
import LineForwardModelInterface from '../types/LineForwardTypes'

const LineForwardModel : Schema = new Schema({
    AccountId :{
        type : String,
        required : false
    },
    ParentCallId:{
        type : String,
        required : false,
        unique : true
    },
    ChildCallId:{
        type : String,
        required : false
    },
    IsShowCallerIdActive : {
        type : Boolean,
        required : true,
        default : false
    },
    ChildCallSid:{
        type : String,
        required : false
    },
    CallType :{
        type : String,
        required : false
    },
    Numbers :{
        type : String,
        required : false
    },
    User :{
        type : String,
        required : false
    },
    Caller :{
        type : String,
        required : false
    },
    ForwardTo :{
        type : String,
        required : false
    },
    StartTime:{
        type : String,
        required : false
    },
    Notes:{
        type : String,
        required : false
    },
    // Tags:{
    //     type : String,
    //     required : false
    // },
    // Tags: 
    // [
    //     {
    //         type : String,
    //         required : false,
    //         default : " "
    //     },  
    // ],
    Tags: [{
        name: {
          type: String,
          required: false,
        },  
        checked: {
          type: Boolean,
          required: false
        },
        backgroundColor: {
            type: String,
            required: false
        }
      }],
    Recording :{
        type : String,
        required : false
    },
    Duration :{
        type : String,
        required : false
    },
    TotalDuration :{
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
    CC_no_answer:{
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
    Url:{
        type : String,
        required : false
    },
    subscribeDate :{
        type : Date,
        required : true,
        default : Date.now
    },
})

export default model<LineForwardModelInterface>('lineforwards', LineForwardModel, 'lineforwards')
