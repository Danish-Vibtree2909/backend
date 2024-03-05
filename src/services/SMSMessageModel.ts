import SMSMessageModel from '../models/SMSMessageModel';
import logger from '../config/logger';

export async function createSmsMessage ( data : any ){
    try{

        const response = await SMSMessageModel.create(data)
        return response

    }catch(err:any){
        logger.error(`Error in creating sms message : ${err}`)
        return false
    }
}

export async function getOneSmsMessage ( queryParams : any ){
    const filterQuery = { ...queryParams };
    const excludeApiFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "offset",
      "populate",
    ];
    //@ts-ignore
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await SMSMessageModel.findOne({ ...filterQuery })
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
} 

export async function getAllSmsMessage ( queryParams : any ){
    const filterQuery = { ...queryParams };
    const excludeApiFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "offset",
      "populate",
    ];
    //@ts-ignore
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await SMSMessageModel.find({ ...filterQuery })
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
} 

export async function countDocumentsSmsMessage(
    queryParams: any,
    userDetails?: any
  ) {
    const filterQuery = { ...queryParams };
    const excludeApiFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "offset",
      "populate",
    ];
  
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery);
    const data = await SMSMessageModel.countDocuments({ ...filterQuery });
    return data;
  }

export async function findOneAndUpdateSmsMessage ( query : any , update : any , option : any){
    try{
        const response = await SMSMessageModel.findOneAndUpdate(query , update , option)
        return response
    }catch(err:any){
        logger.error('Error in updating sms conversation : ' + err)
        return false
    }
}