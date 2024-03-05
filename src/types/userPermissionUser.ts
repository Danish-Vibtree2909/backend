import { Document } from 'mongoose'
import Role from './userPermissionRole'
import Company from './companyType'
import Ticket from './ticketType'
import KYC from './kycDocumentType'
import UserInovice from './userInvoiceType'
import Product from './productType'
import {ICountryAllowed} from './SaveType'    

interface sip_default{
    country : string,
    number : string,
    pattern : string,
}
export default interface UserPermissionUserInterface extends Document{
    is_verified: string;
    user_logo : string;
    sip_cli : string;
    blocked: boolean;
    is_kyc_done : boolean; // to allow user from purchasing number kyc need to be done first.
    status:string;
    username: string;
    email: string;
    fullName: string;
    FirstName: string;
    LastName: string;
    password: string;
    phone: string;
    provider: string;
    company: Company;
    role: Role;
    user_type: string;
    auth_id: string;
    auth_secret: string;
    company_id: string;
    company_name: string;
    fullname: string;
    is_admin: string;
    user_invoices: Array<UserInovice>;
    tickets: Array<Ticket>;
    products: Array<Product>;
    kycDocuments: Array<KYC>;
    country_allowed: ICountryAllowed;
    Tags? : [{name : string , color : string , checked : boolean}];
    phone_allowed: Boolean;
    browser_allowed: Boolean;
    sip_allowed: Boolean;
    createdAt: Date;
    updatedAt: Date;
    linkedin_url: string;
    company_grade: string;
    lineForwardAppId : number;
    lineForwardAppSid : string;
    CloudPhoneAppId : number;
    CloudPhoneAppSid : string;
    IvrStudioAppId : number;
    IvrStudioAppSid : string;
    sip_default : sip_default;
    subscription_type : string;
    sip_user : string;
    sip_password : string;
    selectedColumnForAdmin : {
        lineforwardCheck :{
            callStatus : boolean,
            numbers : boolean,
            recording : boolean,
            callTags : boolean,
            caller : boolean,
            forwardTo : boolean,
            startTime : boolean,
            duration : boolean,
        },
        callTrackingCheck :{
            callStatusCallTracking : boolean,
            numbersCallTracking : boolean,
            recordingCallTracking : boolean,
            callTagsCallTracking : boolean,
            campaignCallTracking : boolean,
            callerCallTracking : boolean,
            routeToCallTracking : boolean,
            startTimeCallTracking : boolean,
            durationCallTracking : boolean,
        },
        cloudPhoneCheck :{
            callStatuscloudPhone : boolean,
            numberscloudPhone : boolean,
            recordingcloudPhone : boolean,
            callTagscloudPhone : boolean,
            userscloudPhone : boolean,
            userTypecloudPhone : boolean,
            callercloudPhone : boolean,
            recievercloudPhone : boolean,
            startTimecloudPhone : boolean,
            durationcloudPhone : boolean,
        },
        ivrCheck : {
            callStatusIvr : boolean,
            callerIvr : boolean,
            recordingIvr : boolean,
            callTagsIvr : boolean,
            flowNameIvr : boolean,
            numbersIvr : boolean,
            recieverIvr : boolean,
            startTimeIvr : boolean,
            durationIvr : boolean,
        }
    }
    selectedColumnForUser : {
        lineforwardCheck :{
            callStatus : boolean,
            numbers : boolean,
            recording : boolean,
            callTags : boolean,
            caller : boolean,
            forwardTo : boolean,
            startTime : boolean,
            duration : boolean,
        },
        callTrackingCheck :{
            callStatusCallTracking : boolean,
            numbersCallTracking : boolean,
            recordingCallTracking : boolean,
            callTagsCallTracking : boolean,
            campaignCallTracking : boolean,
            callerCallTracking : boolean,
            routeToCallTracking : boolean,
            startTimeCallTracking : boolean,
            durationCallTracking : boolean,
        },
        cloudPhoneCheck :{
            callStatuscloudPhone : boolean,
            numberscloudPhone : boolean,
            recordingcloudPhone : boolean,
            callTagscloudPhone : boolean,
            userscloudPhone : boolean,
            userTypecloudPhone : boolean,
            callercloudPhone : boolean,
            recievercloudPhone : boolean,
            startTimecloudPhone : boolean,
            durationcloudPhone : boolean,
        },
        ivrCheck : {
            callStatusIvr : boolean,
            callerIvr : boolean,
            recordingIvr : boolean,
            callTagsIvr : boolean,
            flowNameIvr : boolean,
            numbersIvr : boolean,
            recieverIvr : boolean,
            startTimeIvr : boolean,
            durationIvr : boolean,
        }
    };
    is_login_sip : boolean;
    display_name?: string;
    gupshupId?: string;
    gupshupPassword?: string;
}
