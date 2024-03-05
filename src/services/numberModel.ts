import NumberModel from '../models/numbers'
import logger from '../config/logger'

export async function getNumbers(queryParams: any) {
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
    const data = await NumberModel
      .find({...filterQuery})
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
  }

  export async function countNumberDocuments(queryParams: any, userDetails?: any) {
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
    const data = await NumberModel.countDocuments({...filterQuery});
    return data;
  }

  export async function createNumber ( data :  any ) {
    try{
      const new_number = new NumberModel({...data})
      const response = await new_number.save()
      return response
    }catch(err){
      logger.error(`Error in creating Number after purchasing  : ${err}`)
      return false
    }
  }