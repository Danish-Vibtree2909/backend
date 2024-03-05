import { model, Schema } from 'mongoose'
import IAuth from '../types/auth'
const mongoose = require("mongoose");

const auth : Schema = new Schema({
  is_verified: {
    type: Boolean,
    required: false,
    default: false
  },
  is_powerdialer_active :{
    type: Boolean,
    required: false,
    default: false,
  },
  blocked: {
    type: Boolean,
    required: false,
    default: false
  },
  username: {
    type: String,
    required: false,
    default: null
  },
  gupshupId: {
    type: String,
    required: false
  },
  gupshupPassword: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    
  },
  EmailInVibconnect:{
    type:String,
    required:true,
    default:false
  },
  password: {
    type: String,
    required: true,
    default: null
  },
  fullName: {
    type: String,
    required: false,
    default: null
  },
  FirstName: {
    type: String,
    required: true,
    default: "",
  },
  LastName: {
    type: String,
    required: false,
    default: "",
  },
  user_type: {
    type: String,
    required: false,
    default: null
  },
  company_name: {
    type: String,
    required: false,
    default: null
  },
  company_id:{
    type: String,
    required: false
  },
  agency_name: {
    type: String,
    required: false,
    default: null
  },
  provider: {
    type: String,
    required: false,
    default: null
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    required: false,
    default: new Date()
  },
  company: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null
  },
  role: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null
  },
  auth_id: {
    type: String,
    required: false,
    default: null
  },
  auth_secret: {
    type: String,
    required: false,
    default: null
  },
  sip_user: {
    type: String,
    required: false,
    default: null
  },
  sip_password: {
    type: String,
    required: false,
    default: null
  },
  
  
  updated_by: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null
  },
  api_token: {
    type: String,
    required: false,
    default: null
  },
  api_token_list: {
    type: Array,
    required: false,
  },
  is_logged_in :{
    type:Boolean,
    required:false,
  },
  GotNumbers: {
    type: Boolean,
    required: false,
    default: false
  },
  country_allowed: [{
    code: {
      type: String,
      required: false,
      default: null
    },
    phone: {
      type: String,
      required: false,
      default: null
    }
  }],
  Tags: [{
    name: {
      type: String,
      required: false,
      default: null
    },
    color: {
      type: String,
      required: false,
      default: null
    },
    checked: {
      type: Boolean,
      required: false,
    }
  }],
  sip_default: {
    country: {
      type: String,
      required: false,
    },
    number: {
      type: String,
      required: false,
    },
    pattern:{
      type:String,
      required:false
    }
  },
  subscription_type:{
    type:String,
    required:false
  },
  phone_allowed:{
    type : Boolean,
    required : true,
    default : true,
  },
  browser_allowed:{
    type : Boolean,
    required : true,
    default : true,
  },
  sip_allowed:{
    type : Boolean,
    required : true,
    default : true,
  },
  is_admin: {
    type: Boolean,
    required: false,
    default: false
  },
  lineForwardAppId:{
    type:Number,
    required:false,
  },
  lineForwardAppSid:{
    type:String,
    required:false,
  },
  CloudPhoneAppId:{
    type:Number,
    required:false,
  },
  CloudPhoneAppSid:{
    type:String,
    required:false,
  },
  IvrStudioAppId:{
    type:Number,
    required:false,
  },
  IvrStudioAppSid:{
    type:String,
    required:false,
  },
  CancelNumberAppId:{
    type:Number,
    required:false,
  },
  CancelNumberAppSid:{
    type:String,
    required:false,
  },
  SipUserAppId:{
    type:Number,
    required:false,
  },
  SipUserAppSid:{
    type:String,
    required:false,
  },
  selectedColumnForAdmin :{
    lineforwardCheck :{
      callStatus :{
        type:Boolean,
        default: true,
        required : false
      },
      numbers :{
        type:Boolean,
        default: true,
        required : false
      },
      recording  :{
        type:Boolean,
        default: true,
        required : false
      },
      callTags :{
        type:Boolean,
        default: true,
        required : false
      },
      caller :{
        type:Boolean,
        default: true,
        required : false
      },
      forwardTo :{
        type:Boolean,
        default: true,
        required : false
      },
      startTime:{
        type:Boolean,
        default: true,
        required : false
      },
      duration :{
        type:Boolean,
        default: true,
        required : false
      }
    },
    callTrackingCheck :{
      callStatusCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      numbersCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      recordingCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      callTagsCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      campaignCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      callerCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      routeToCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      startTimeCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      durationCallTracking:{
        type:Boolean,
        default: true,
        required : false
      }
    },
    cloudPhoneCheck :{
      callstatuscloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      numberscloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      recordingcloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      callTagscloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      usercloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      userTypecloudPhone :{
        type:Boolean,
        default: true,
        required : false
      },
      callercloudPhone : {
        type:Boolean,
        default: true,
        required : false
      },
      recievercloudPhone : {
        type:Boolean,
        default: true,
        required : false
      },
      startTimecloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      durationcloudphone:{
        type:Boolean,
        default: true,
        required : false
      },

    },
    ivrCheck :{
      callStatusIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      callerIvr :{
        type:Boolean,
        default: true,
        required : false
      },
      recordingIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      callTagsIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      flowNameIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      numbersIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      recieverIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      startTimeIvr :{
        type:Boolean,
        default: true,
        required : false
      },
      durationIvr :{
        type:Boolean,
        default: true,
        required : false
      }
    }
  },
  selectedColumnForUser :{
    lineforwardCheck :{
      callStatus :{
        type:Boolean,
        default: true,
        required : false
      },
      numbers :{
        type:Boolean,
        default: true,
        required : false
      },
      recording  :{
        type:Boolean,
        default: true,
        required : false
      },
      callTags :{
        type:Boolean,
        default: true,
        required : false
      },
      caller :{
        type:Boolean,
        default: true,
        required : false
      },
      forwardTo :{
        type:Boolean,
        default: true,
        required : false
      },
      startTime:{
        type:Boolean,
        default: true,
        required : false
      },
      duration :{
        type:Boolean,
        default: true,
        required : false
      }
    },
    callTrackingCheck :{
      callStatusCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      numbersCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      recordingCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      callTagsCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      campaignCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      callerCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      routeToCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      startTimeCallTracking:{
        type:Boolean,
        default: true,
        required : false
      },
      durationCallTracking:{
        type:Boolean,
        default: true,
        required : false
      }
    },
    cloudPhoneCheck :{
      callstatuscloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      numberscloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      recordingcloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      callTagscloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      usercloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      userTypecloudPhone :{
        type:Boolean,
        default: true,
        required : false
      },
      callercloudPhone : {
        type:Boolean,
        default: true,
        required : false
      },
      recievercloudPhone : {
        type:Boolean,
        default: true,
        required : false
      },
      startTimecloudphone:{
        type:Boolean,
        default: true,
        required : false
      },
      durationcloudphone:{
        type:Boolean,
        default: true,
        required : false
      },

    },
    ivrCheck :{
      callStatusIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      callerIvr :{
        type:Boolean,
        default: true,
        required : false
      },
      recordingIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      callTagsIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      flowNameIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      numbersIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      recieverIvr : {
        type:Boolean,
        default: true,
        required : false
      },
      startTimeIvr :{
        type:Boolean,
        default: true,
        required : false
      },
      durationIvr :{
        type:Boolean,
        default: true,
        required : false
      }
    }
  },
  ivrColumnSettings: [
    {
      type: Schema.Types.Mixed,
      required: false,
    }
  ],
  contactColumnSettings: [
    {
      type: Schema.Types.Mixed,
      required: false,
    }
  ],
  contactColumn :{
    type: Schema.Types.Mixed,
    required: false,
  },
  lastViewOption : {
    type:String,
    default: 'Ivr',
    required : false
  },
  assignedNumber : [
    {
      type:String,
      required : false
    }
  ],
  Role : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'role',
  },
  viewType : {
    type:String,
    default: 'All',
    required : false
  },
  callBackNumber : {
    type:String,
    required : false
  },
  callBackActive : {
    type:Boolean,
    default: false,
    required : true
  },
  uniqueId :{
    type : String,
    required : false
  },
  otp:{
    type: String,
    required : false
  },
  phone: {
    type: String,
    required: true,
  },
  timeFormat:{
    type: String,
    required : false
  },
  customerIdInZoho:{
    type: String,
    required : false
  },
  aadharNo:{
    type: String,
    required : false
  },
  ivrColumn : {
    CallStatus : {
      type :Boolean,
      required : false,
      default : true
     },
     From : {
      type :Boolean,
      required : false,
      default : true
     },
     FlowName : {
      type :Boolean,
      required : false,
      default : true
     },
     Tags : {
      type :Boolean,
      required : false,
      default : true
     },
     CloudNumber : {
      type :Boolean,
      required : false,
      default : true
     },
     User :{
      type : Boolean,
      required : false,
      default : true
     },
     status : {
      type :Boolean,
      required : false,
      default : true
     },
     reciever : {
      type :Boolean,
      required : false,
      default : true
     },
     startTime : {
      type :Boolean,
      required : false,
      default : true
     },
     TalkTime : {
      type :Boolean,
      required : false,
      default : true
     },
     action : {
      type :Boolean,
      required : false,
      default : true
     },
     recording : {
      type :Boolean,
      required : false,
      default : true
     }
    },
    inboxVoiceStatus: [
      {
        type: Schema.Types.Mixed,
        required: false,
      }
    ],
    display_name : {
      type : String,
      required : false
    },
    max_session:{
      type:Number,
      required:false,
      default : 0
    },
    active_session:{
      type:Number,
      required:false,
      default : 0
    },
    timeZone:{
      type: String,
      required : false
    },
})

export default model<IAuth>('auth', auth, 'users-permissions_user')
