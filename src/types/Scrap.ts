import { Document } from 'mongoose'
export default interface IScrap extends Document{
    link: String,
    title: String,
    length: String,
    poster: String,
    iFrame: String,
    tags: String,
    featured: String,
    uploadedOn: String,
    category: String,
    IsScrapComplete: Boolean,
    inProcess: Boolean
}
