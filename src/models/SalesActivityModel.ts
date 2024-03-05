import {model,Schema} from 'mongoose';  
import {SalesActivityTypes} from '../types/SalesActivityTypes';
const mongoose = require('mongoose');


const SalesActivitySchema = new Schema({
    type: {
        type: String,
        required: false
    },
    contact_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'leads',
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    notes: {
        type: String,
        required: false
    }
});

export default model<SalesActivityTypes>('sales_activity', SalesActivitySchema);