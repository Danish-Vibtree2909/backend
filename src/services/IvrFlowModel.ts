import ivrFlowModel from "../models/ivrFlowModel";
import logger from "../config/logger";

export async function getDetails(queryParams : any ) {
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
  const data = await ivrFlowModel
    .find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countDocuments(queryParams : any ) {
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
  const data = await ivrFlowModel.countDocuments({ ...filterQuery });
  return data;
}

export async function ivrFlowFindOneAndUpdate(query: any  , updates : any , option : any) {
  try {
    const response = await ivrFlowModel.findOneAndUpdate(
      query,
      updates,
      option
    );
    return response;
  } catch (err) {
    logger.error(`Error in updating IvrFlow : ${err}`);
    return false;
  }
}

export async function getIvrFlowCdrWithId(id : any , queryParams?: any ) {
  const data = await ivrFlowModel
    .findById(id)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function updateIvrFlowCdrWithId(query : any , updates : any , options : any) {
  const data = await ivrFlowModel
    .findByIdAndUpdate(query , updates, options)

  return data;
}
