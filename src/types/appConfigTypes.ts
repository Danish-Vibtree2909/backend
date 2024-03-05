import {Document} from 'mongoose';

export default interface appConfigTypes extends Document {
    user_id : any ;
    app_name : string ;
    is_active : boolean ;
    extension_active? : boolean ;
    phoneApp_active? : boolean ;
    country_allow? : [ {
        code : string ,
        phone : string
    }] ;
    default_country? : {
        code : string ,
        phone : string 
    };
    cloudNumber_allow? : any ;
    call_allow? : string ;
    type_allow? : string;
    phone_mode? : string ;
    sip_mode? : string ;
    sip_active? : boolean ;
    sip_id? : string ;
    sip_password? : string ;
    sip_domain? : string ;
    urlPop_active? : boolean ;
    urlPop? : {
        url_dir : string;
        inbox_id : any ;
        url_string : string ;
    };
    hide_contact? : boolean;
    pwd_allow? : boolean;
    updated_by? : any ;
    disable_contact? : boolean ;
    queryValue? : any ;

    //ticket config 
    stages? : any;
    tkt_prefix? : string;
    next_tkt_id? : string;
    create? : boolean;
    edit? : boolean;
    download ?: boolean;
    active_on ? : any;
    active_by ? : any;
    lastmod_on ? : any;
    lastmod_by? : any;
    auth_id? : string;
}