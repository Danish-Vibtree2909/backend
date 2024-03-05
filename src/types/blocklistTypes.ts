import {Document} from 'mongoose';

export default interface BlockListTypes extends Document {

    authId : string;
    number : string;

}