import {model , Schema } from 'mongoose';
import CallTrackingModelInterFace from '../types/CallTrackingTypes';

const CallTrackingLiveModel : Schema = new Schema({
    AccountId:{
        type : String,
        required : false 
    },
    ParentCallId : {
        type : String,
        required : false    
    },
    CallType:{
        type : String,
        required : false 
    },
    //from of parent call
    Caller: {
        type : String,
        required : false 
    },
    CampaignId:{
        type : String,
        required : false 
    },
    CampaignName : {
        type : String,
        required : false 
    },
    //to of initiated parent call
    TrackingNumber: {
        type : String,
        required : false 
    },
    //time stamp of initiated of parent call
    StartTime  : {
        type : String,
        required : false 
    },
    //to of last call back of child belongs to that parent call
    Route:{
        type : String,
        required : false 
    },
    RouteName: {
        type : String,
        required : false 
    },
    RouteId: {
        type : String,
        required : false 
    },
    //CallStatus of last callback of child call related to parent call
    CallStatus: {
        type : String,
        required : false 
    },
    CallDuration: {
        type : String,
        required : false 
    },
    Notes : {
        type : String,
        required : false 
    },
    Tags : {
        type : String,
        required : false 
    },
    CallCost : {
        type : String,
        required : false 
    },
    CC_in_progress : {
        type : String,
        required : false 
    },
    subscribeDate :{
        type : Date,
        required : true,
        default : Date.now
    }
});

export default model<CallTrackingModelInterFace>('realtime_callTracking', CallTrackingLiveModel);