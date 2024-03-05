import {Document} from 'mongoose'

export default interface FormattedPagesPostTypes extends Document{
    AccountSid : string,
    pageId : string,
    postId : string,
    description : any ,
    reaction : any ,
    comments : any ,
}