import ivrFlowUIModel from '../models/ivrFlowUIModel'
import logger from "../config/logger";

export async function getWorkFlows(queryParams: any){
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
    const data = await ivrFlowUIModel
      .find({ ...filterQuery })
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
}


export async function countWorkFlowDocuments(queryParams: any) {
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
    const data = await ivrFlowUIModel.countDocuments({ ...filterQuery });
    return data;
  }

  export async function getWorkFlowWithId(id : any , queryParams? : any) {
    const data = await ivrFlowUIModel
      .findById(id)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
  }

  export async function updateWorkFlowWithId(query : any , updates : any , options : any )  {
    const data = await ivrFlowUIModel
      .findByIdAndUpdate(query , updates, options)
  
    return data;
  }

  export async function createWorkFlow (data : any ){
    try{
        const workFlow = new ivrFlowUIModel(data)
        const response = await workFlow.save()
        return response
      }catch(err){
        logger.error(`Error in creating Work Flow : `)
        logger.error(err)
        return err
      }
}

export async function deleteWorkFlowById ( id :any ){
    try{
        const data = await ivrFlowUIModel.findByIdAndDelete(id)
        return data
    }catch(err){
        logger.error(`Error in creating Work Flow : `)
        logger.error(err)
        return false
    }
   
    
}

export async function updateManyWorkFlow ( query : any , update : any , option : any ){
  try{
    const response = await ivrFlowUIModel.updateMany( query , update , option )
    return response
  }catch(err : any){
    logger.error(`Error in update many workflow : ${err}`)
    return false
  }
}