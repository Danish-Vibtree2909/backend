import {Document} from 'mongoose';

export default interface BusinessHourTypes extends Document {
    authId : string;
    userId : any;
    data : any;
}