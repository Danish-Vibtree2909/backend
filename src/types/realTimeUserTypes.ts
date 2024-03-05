import {Document} from 'mongoose';

export default interface IRealTimeUserTypes extends Document {
    AccountSid : string,
    AccountSecretId : string,
    To : string,
    From : string,
    ConferenceSid : string,
    FriendlyName : string,
    userID : any,
    UserStartTime : any //parent call start time
    ParticipantCount : any,
    ContactStartTime : any,
    ContactId : any,
    ContactNumber : string,
    ContactName : string,
    ContactStatus : string, //Child call Status
    CloudNumber : string,
    ContactParticipantId : string , //participant id of child calls,
    Tags : any,
    Notes : any,
}