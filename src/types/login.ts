import { Document } from 'mongoose'

export interface ILogin extends Document{
    'email_address': string,
    password:string
}
