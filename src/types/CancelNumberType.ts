import { Document } from 'mongoose'
export default interface IMyNumbers extends Document{
    authId: string;
    number: string;
    type : string;
    country : string;
    purchasedDate : Date;
    canceledDate : Date;

}
