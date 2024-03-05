import { Document } from 'mongoose'
export default interface IDEModelInterface extends Document{
    sid: string;
    username: string;
    notes: string;
    tags: string;
    dialedNo: string;
    cloudNumber: string;
}
