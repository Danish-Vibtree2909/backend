import AvailableNumberModel from "../models/availableNumbers";
import logger from '../config/logger'

export async function getAvailableNumbers(queryParams: any) {
  
  const filterQuery = { ...queryParams };
  const excludeApiFields = [
    "page",
    "sort",
    "limit",
    "fields",
    "offset",
    "populate",
    "stateName",
  ];

  excludeApiFields.forEach((e) => delete filterQuery[e]);
  console.log("Query service : ", filterQuery, queryParams);
  const data = await AvailableNumberModel.find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countAvailableNumbers(
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
    "stateName"
  ];

  excludeApiFields.forEach((e) => delete filterQuery[e]);
  //console.log("Query service : ", filterQuery);
  const data = await AvailableNumberModel.countDocuments({ ...filterQuery });
  return data;
}

export async function deleteAvailableNumbers(query : any){
  try{
    const deletedNumberDetails = await AvailableNumberModel.deleteOne(query)
    return deletedNumberDetails
  }catch(err){
    logger.error(`Error while deleting number from available number : ${err}`)
    return false
  }
}