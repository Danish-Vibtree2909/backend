import IvrStudiousRealTime from "../models/IvrStudiousRealTime";
import logger from "../config/logger";

export async function getRealtimeCall(queryParams: any) {
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
  const data = await IvrStudiousRealTime.find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function getParticularRealtimeCall(queryParams: any) {
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
  const data = await IvrStudiousRealTime.findOne({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function createDetail(data: any) {
  try {
    const tempObj = new IvrStudiousRealTime(data);
    const response = await tempObj.save();
    return response;
  } catch (err) {
    logger.error(`Error in creating RealTime IvrStudios : ${err}`);
    return false;
  }
}

export async function updateRealtimeDetails(
  query: any,
  updates: any,
  options?: any
) {
  const response = await IvrStudiousRealTime.updateOne(query, updates, options);
  return response;
}

export async function findOneAndDeleteRealtimeDetails(query: any) {
  const response = await IvrStudiousRealTime.findOneAndDelete(query);
  return response;
}

export async function findManyAndDeleteRealtimeDetails(query: any) {
  const response = await IvrStudiousRealTime.deleteMany(query);
  return response;
}

export async function getRealtimeCallById(id: any, queryParams?: any) {
  const data = await IvrStudiousRealTime.findById(id)
    .select(queryParams?.fields)
    .populate(queryParams?.populate);

  return data;
}

export async function deleteRealtimeDetailsById(id: any) {
  try {
    const response = await IvrStudiousRealTime.findByIdAndDelete(id);
    return response;
  } catch (err) {
    logger.error(`Error in deleting ${id} RealTime IvrStudios : ${err}`);
    return false;
  }
}
