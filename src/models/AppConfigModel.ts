import { model , Schema } from 'mongoose';
import appConfigTypes from '../types/appConfigTypes';

const AppConfigModel = new Schema({
    app_name : {
        type : String ,
        required : true,
        default : 'cloudphone',
        immutable : true
    },
    user_id : {
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'user',
    },
    updated_by : {
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'user',
    },
    is_active : {
        type : Boolean,
        required : false
    },
    urlPop_active : {
        type : Boolean,
        required : false
    },
    urlPop : {
        url_dir : {
            type : String,
            required : false
        },
        inbox_id :{
            type : Schema.Types.ObjectId,
            required : false,
            ref : 'inbox_view',
        },
        url_string :{
            type : String,
            required : false
        }
    },
    extension_active : {
        type : Boolean,
        required : false,
        deafult : false
    },
    phoneApp_active : {
        type : Boolean,
        required : false,
        deafult : false
    },
    hide_contact : {
        type : Boolean,
        required : false
    },
    disable_contact : {
        type : Boolean,
        required : false
    },
    pwd_allow : {
        type : Boolean,
        required : false
    },
    queryValue : {
        type : Schema.Types.Mixed,
        required : false,
    },
    country_allow : [
        {
            code : {
                type : String,
                required : false
            },
            phone :{
                type : Number,
                required : false
            }
        }
    ],
    default_country : {
        code : {
            type : String,
            required : false
        },
        phone :{
            type : Number,
            required : false
        }
    },
    cloudNumber_allow : [
        {
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'number',
    }
    ],
    call_allow : {
        type : String,
        required : false
    },
    type_allow : {
        type : String,
        required : false
    },
    phone_mode : {
        type : String ,
        required : false
    },
    sip_mode : {
        type : String ,
        required : false
    },
    sip_active : {
        type : Boolean,
        required : false
    },
    sip_id : {
        type : String,
        required : false
    },
    sip_password : {
        type : String,
        required : false
    },
    sip_domain :{
        type : String,
        required : false
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

    //ticket config and //power_dialer config // voice_mail config
    stages : {
        type : Schema.Types.Mixed,
        required : false,  
    },
    tkt_prefix : {
        type : String,
        required : false
    },
    next_tkt_id : {
        type : String,
        required : false
    },
    download : {
        type : Boolean,
        required : false
    },
    create : {
        type : Boolean,
        required : false
    },
    edit : {
        type : Boolean,
        required : false
    },
    delete : {
        type : Boolean,
        required : false
    },
    active_on : {
        type: Date,
        default: ()=> Date.now(),
        immutable: true
    },
    active_by : {
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'user',
    },
    lastmod_on : {
        type: Date,
        default:()=> Date.now(),
    },
    lastmod_by : {
        type : Schema.Types.ObjectId,
        required : false,
        ref : 'user',
    },
    auth_id : {
        type : String,
        required : false
    }

})

export default model<appConfigTypes>('app_config', AppConfigModel)