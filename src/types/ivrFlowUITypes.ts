import {Document} from 'mongoose';



export default interface IvrFlowUI extends Document {
    name: string;
    auth_id : string;
    variables? : [
        {
            key : string;
            value : string;
        }
    ],
    input : 
    [
        {
            data ?: any
            id : string
            position ?: { x: string, y: string }
            type ? : string
            record ? : boolean
            animated ? : boolean
            source ? : string
            sourceHandle ? : string
            style ?: {stroke: string},
            target ? : string
            targetHandler ? : string
        }
    ],
    number : string;
    active?: boolean;
    createdAt ?: any;
    updatedAt ?: any;
}