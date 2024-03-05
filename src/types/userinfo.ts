import { Request } from 'express'

export interface UserInfo extends Request<any>{
    user : object,
    headers: {
        token : string,
        host : string
    },
    file : any,

    files : any

}
