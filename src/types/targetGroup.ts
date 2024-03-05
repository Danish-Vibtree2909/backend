import { Document } from 'mongoose'
export default interface targetGroup extends Document{
    name: string;
    target_ids: string[];
    target_group_id : string
}
