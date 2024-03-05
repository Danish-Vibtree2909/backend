/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose'
import { ICountryCode } from '../types/SaveType'

export interface  IRegister extends Document{

    first_name:string;
    last_name: string;
    company_name: string;
    company_id:string;
    country: ICountryCode;
    phone_number: string;

    email: string;

    password : string;
    email_formatted : string;

    api_token? : string;
    industry? : string;
    company_size? : string;
    company_logo? : string;
}

interface IFileHeaders {

    'content-disposition' : string,
    'content-type' : string

}

export interface IFile{
    fieldName : string,
    originalFilename: string,
    path : string,
    headers : IFileHeaders,
    size : Number,
    name: string,
    type:string
}
