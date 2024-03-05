import {model , Schema} from 'mongoose';
import BlockListTypes from '../types/blocklistTypes';

const BlocklistModel = new Schema({
    authId : {
        type : String,
        required : false
    },
    number : {
        type : String,
        required :  false
    }
})

export default model<BlockListTypes>('blocklist', BlocklistModel )