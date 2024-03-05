import { Document } from 'mongoose';

export default interface AlliesType extends Document {
    partner : string ; // Name of company which is giving service.
    data : any ; // Based on company we keep any data require in there business.
}