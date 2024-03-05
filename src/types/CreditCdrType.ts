import { Document } from 'mongoose';

export default interface CreditCdrInterface extends Document {
    createdAt : Date; // it is in UTC (GMT:00)
    companyId : any ;
    amount : number ;
    source : string ;
    callId?: any ;
    smsId?: any ;
    numberId?: any ;
}