import {Document} from 'mongoose';

export default interface vibconnectInterface extends Document{
    authId : string;
    userId : any;
    companyId : any;
    createdBy : any;
    authSecret : string;
    applicationId? : any;
    createdAt : any;
}