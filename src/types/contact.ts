import { Document } from 'mongoose'
export default interface IContact extends Document{
    name: String,
    email: string,
    message: string
}
