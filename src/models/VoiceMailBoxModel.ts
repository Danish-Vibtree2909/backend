import {model , Schema} from 'mongoose';
import VoiceMailBoxTypes from '../types/VoiceMailBoxTypes';

const VoiceMailBoxSchema = new Schema({
Name: {
    type: String,
    required: false,
},
AuthId : {
    type: String,
    required: false,
},
createdAt:{
    type: Date,
    default: ()=> Date.now(),
    immutable: true
},
updatedAt:{
    type: Date,
    default:()=> Date.now(),
},
});

export default model<VoiceMailBoxTypes>('VoiceMailBox', VoiceMailBoxSchema);