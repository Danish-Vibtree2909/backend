import {model, Schema} from 'mongoose'
import IConference from '../types/conference';

const ConferenceModel : Schema = new Schema({
    AccountSid : {
        type: String,
        required: false
    },
    whispherUrl : {
        type: String,
        required: false
    },
    callDistributionType : {
        type: String,
        default: 'Priority',
        required: false
    },
    listOfAgentsCallSid :[
        {
            type: String,
            required: false
        }
    ],
    source : {
        type: String,
        required: false
    },
    id: {
        type: String,
        required: false
    },
    ParentCallSid: {
        type: String,
        required: false
    },
    CallSid: {
        type: String,
        required: false,
    },
    ConferenceId: {
        type: String,
        required: false,
    },
    CallStatus: {
        type: String,
        required: false,
    },
    ChildCallStatus: {
        type: String,
        required: false,
    },
    expireAt: {
        type: Date,
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
    ChildCallSid : {
        type: String,
        required: false
    },
    listOfChildCallSid : [
        {
            type: String,
            required: false
        }
    ],
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
    isMessageSent : {
        type: Boolean,
        required : true,
        default : true
    },
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
});

ConferenceModel.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default model<IConference>('conference', ConferenceModel);