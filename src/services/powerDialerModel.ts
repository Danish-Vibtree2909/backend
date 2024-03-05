import powerDialerModel from "../models/powerDialerModel";
import logger from '../config/logger'

export async function getAllPowerDialer(queryParams : any ){
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
    const data = await powerDialerModel
      .find({...filterQuery})
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
}

export async function countDocumentPowerDialer(queryParams : any, userDetails?: any ) {
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
    const data = await powerDialerModel.countDocuments({...filterQuery});
    return data;
  }

export async function createPowerDialer (data : any ){
    try{
        const powerDialer = new powerDialerModel(data)
        const response = await powerDialer.save()
        return response
      }catch(err){
        logger.error(`Error in creating conference call back : `)
        logger.error(err)
        return err
      }
}

export async function findByIdAndUpdatePowerDialer ( query : any , updates : any, options : any){
  try{
    const updatedBlockList = await powerDialerModel.findByIdAndUpdate(query , updates, options)
    return updatedBlockList
  }catch(err){
    logger.error('error in updating power dialer : ')
    logger.error(err)
    return false
  }

}

export async function findByIdAndDeletePowerDialer ( query : any){
  try{
    const updatedBlockList = await powerDialerModel.findByIdAndDelete(query)
    return updatedBlockList
  }catch(err){
    logger.error('error in deleting power dialer : ')
    logger.error(err)
    return false
  }

}

export async function deleteManyPowerDialer ( query : any){
  try{
    const updatedBlockList = await powerDialerModel.deleteMany(query)
    return updatedBlockList
  }catch(err){
    logger.error('error in deleting power dialer : ')
    logger.error(err)
    return false
  }

}

export async function insertManyPowerDialer ( query : any ){
  try{
    const updatedBlockList = await powerDialerModel.insertMany(query)
    return updatedBlockList
  }catch(err){
    logger.error('error in insertMany power dialer : ')
    logger.error(err)
    return false
  }

}

export async function getPowerDialerDetailsById ( query : any){
  try{
    const foundDetails = await powerDialerModel.findById(query)
    return foundDetails
  }catch(err){
    logger.error('error in  get by id of power dialer : ')
    logger.error(err)
    return false
  }
}
