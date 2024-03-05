import SubscriptionModel from "../models/SubscriptionModel";
import logger from '../config/logger'

export async function getOneSubscription (queryParams : any){
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
    // console.log("Query service : ", filterQuery, queryParams);
    const data = await SubscriptionModel.findOne({ ...filterQuery })
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
}

export async function createSubscription ( data : any ){
    try {
        const mongoObj = new SubscriptionModel(data);
        const response = await mongoObj.save();
        return response;
      } catch (err) {
        logger.error(`Error in creating subscription : ${err}`);
        return false;
      }
}

export async function updateOneSubscription ( query : any , update : any , options : any ){
  try{

    const updatedDetails = await SubscriptionModel.updateOne(query , update , options)
    return updatedDetails

  }catch(err: any){
    logger.error(`Error in updating Subscription : ${err}`)
    return false
  }
}