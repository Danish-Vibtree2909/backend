import {Document} from 'mongoose';

export default interface app extends Document {
    auth_id : string ;
    app_id : any ;
    active_on : any ;
    active_by : any ;
    createdAt : any ;
    updatedAt : any ;
    app_name? : string;
}