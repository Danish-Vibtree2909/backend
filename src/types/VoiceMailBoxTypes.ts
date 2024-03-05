import {Document} from 'mongoose';

export default interface VoiceMailBoxTypes extends Document {
    Name: string;
    AuthId : string;
}