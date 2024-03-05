/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { Document } from 'mongoose'
import { i_am } from './profile'

enum area_of{

    five_miles = '5 Miles of',
    ten_miles = '10 Miles of',
    twenty_five = '25 Miles of',
    fifty_miles = '50 Miles of',
    hundred_miles = '100 Miles of',
    two_fifty_miles = '250 Miles of',
    any = 'any'
}

export default interface ISearch extends Document{
    user_id : String,
    i_am_a:i_am,
    seeking:i_am,
    between : {
        start : Number,
        end : Number
    },
    within : {
        area_of : area_of,
        zip : Number
    }
}
