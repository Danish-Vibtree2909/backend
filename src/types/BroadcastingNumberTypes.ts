import {Document} from 'mongoose';

export default interface IBroadcastingNumber extends Document{
    number : string ,
    count : number 
}