/* eslint-disable camelcase */
import { Document } from 'mongoose'
export interface Sliders extends Document{
    title:String,
    anchor_title:String,
    anchor_link:String,
    image_link:any,
    image:any
}
