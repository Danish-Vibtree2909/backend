import CreditCdrModel from "../models/CreditCdrModel";
import logger from '../config/logger';

export interface CreditCdrInterface {
    createdAt : Date;
    companyId : any ;
    amount : number ;
    source : string ;
    callId?: any ;
    smsId?: any ;
    numberId?: any ;
}
export async function createCreditCdr ( data : CreditCdrInterface ){
    try{
        const response = await CreditCdrModel.create(data)
        return response
    }catch(err: any){
        logger.error(`Error in creating credit logs : ${err}`)
        return false
    }
}