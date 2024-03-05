import {Document} from 'mongoose'

export default interface MetaPagePostTypes extends Document {
    data : [
        {
            created_time : any,
            story ?: string,
            id : string,
            message? : string
        }
    ],
    paging : {
        cursors :{
            before : string,
            after : string
        },
        next : string,
    }
}