import SMSConversationModel from '../models/SMSConversationModel';
import logger from '../config/logger';

export async function createSmsConversation ( data : any ){
    try{

        const response = SMSConversationModel.create(data)
        return response

    }catch(err:any){
        logger.error(`Error in creating sms conversation : ${err}`)
        return false
    }
}

export async function getOneSmsConversation ( queryParams : any ){
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
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await SMSConversationModel
      .findOne({ ...filterQuery })
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
}

export async function getAllSmsConversations ( queryParams : any ){
    const filterQuery = { ...queryParams };
    console.log("Filter Query : ", JSON.stringify(filterQuery))
    const excludeApiFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "offset",
      "populate",
      "name",
      "number"
    ];
  
    excludeApiFields.forEach((e) => delete filterQuery[e]);
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await SMSConversationModel
      .find({ ...filterQuery })
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
}

export async function findOneAndUpdateSmsConversatio ( query : any , update : any , option : any){
    try{
        const response = await SMSConversationModel.findOneAndUpdate(query , update , option)
        return response
    }catch(err:any){
        logger.error('Error in updating sms conversation : ' + err)
        return false
    }
}

export async function countDocumentsSmsConversation(
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
    const data = await SMSConversationModel.countDocuments({ ...filterQuery });
    return data;
  }