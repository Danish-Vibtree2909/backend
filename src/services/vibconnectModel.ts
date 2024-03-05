import vibconnectModel from '../models/vibconnectModel';
import logger from '../config/logger'

export async function getVibconnect(queryParams : any) {
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
    const data = await vibconnectModel
      .find({...filterQuery})
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
  }

export async function createVibconnect (data : any){
  try{
    const vibconnect = new vibconnectModel(data)
    const response = vibconnect.save()
    return response
  }catch(err){
    logger.error(`error in creating vibcoonect model : ${err}`)
    return false
  }
}