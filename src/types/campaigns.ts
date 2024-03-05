import { Document } from 'mongoose'
import { ICountryCodeString } from './SaveType'
export default interface campaigns extends Document{
    AccountId : string;
    call_distribution_algo: string;
    country: ICountryCodeString;
    inbound_call_did: string;
    is_played: true;
    campaign_name : string;
    target_group_id: string;
    target_id: string;
    action: string;
    campaign_id : string;
}
