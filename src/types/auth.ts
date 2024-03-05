import { Document, ObjectId } from 'mongoose'
import { ICountryAllowed } from './SaveType'
export default interface IAuth extends Document {
    customerIdInZoho: any;
    selectedColumnForAdmin : any;
    selectedColumnForUser : any ;
    ivrColumn: any;
    is_powerdialer_active : any;
    EmailInVibconnect : any;
    fullName: any;
    FirstName : any;
    LastName: any;
    contactColumnSettings : any;
    ivrColumnSettings : any;
    callBackActive: any;
    viewType : any;
    max_session: any;
    inboxVoiceStatus: any;
    lastViewOption : any;
    is_admin : any;
    api_token_list : any;
    active_session : any;
    company_grade : any;
    phone: any;
    tickets: any;
    user_invoices: any;
    is_logged_in : any;
    kycDocuments: any;
    status : any;
    is_login_sip: any;
    timeZone: any;

    is_verified: boolean;
    blocked: boolean;
    username: string;
    email: string;
    password: string;
    fullname: string;
    user_type: string;
    company_name: string;
    company_id : string;
    agency_name: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
    company: ObjectId;
    role: ObjectId
    auth_id: string;
    auth_secret: string;
    updated_by: ObjectId;
    api_token?: string;
    GotNumbers: false;
    sip_user : string;
    sip_password : string;
    country_allowed: ICountryAllowed;
    Tags? : [{name : string , color : string , checked : boolean}];
    phone_allowed: Boolean;
    browser_allowed: Boolean;
    sip_allowed: Boolean;
    IvrStudioAppId : any;
    assignedNumber : any;
    gupshupId?: string;
    gupshupPassword?: string;
}
