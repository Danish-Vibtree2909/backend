import { Document } from 'mongoose'
import { ICountryCode } from './SaveType'
export default interface IMyNumbers extends Document{
    authId: string;
    number: string;
    country: ICountryCode;
    status: 'verified' | 'not-verified';
    cancel: boolean;

}
