import { Document, Schema } from 'mongoose'
export default interface INumbersUsedFor extends Document{
    number: string;
    usedFor: 'line_forward' | 'call_flows' | 'cloud_phone' | 'call_tracking' |'Voice_mail';
    user: Schema.Types.ObjectId;
    auth_id : string;
}
