import { Document } from 'mongoose'
export default interface Admin extends Document {
    username: string;
    password: string;
    fullname: string;
    Status: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
