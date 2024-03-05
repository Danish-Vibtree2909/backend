import AppConfigModel from "../models/AppConfigModel";
import logger from "../config/logger";

export async function getAllApplicationConfiguration(queryParams: any) {
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
  const data = await AppConfigModel.find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function getOneApplicationConfiguration(queryParams: any) {
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
  const data = await AppConfigModel.findOne({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countDocumentAppConfig(
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
  const data = await AppConfigModel.countDocuments({ ...filterQuery });
  return data;
}

export async function createAppConfig(data: any) {
  try {
    const mongoObj = new AppConfigModel(data);
    const response = await mongoObj.save();
    return response;
  } catch (err) {
    logger.error(`Error in creating App Config : ${err}`);
    return err;
  }
}

export async function findByIdAndUpdateAppConfig(
  query: any,
  updates: any,
  options?: any
) {
  try {
    const updated = await AppConfigModel.findByIdAndUpdate(
      query,
      updates,
      options
    );
    return updated;
  } catch (err) {
    logger.error("error in updating App Config : " + err);
    return false;
  }
}

export async function findOneAndUpdateAppConfig(
  query: any,
  updates: any,
  options?: any
) {
  try {
    const updated = await AppConfigModel.findOneAndUpdate(
      query,
      updates,
      options
    );
    return updated;
  } catch (err) {
    logger.error("error in updating App Config : " + err);
    return false;
  }
}

export async function getByIdAppConfig(id: any, queryParams?: any) {
  //console.log("Query service : ", filterQuery, queryParams);
  const data = await AppConfigModel.findById(id)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function findByIdAndDeleteAppConfig(query: any) {
  try {
    const updatedBlockList = await AppConfigModel.findByIdAndDelete(query);
    return updatedBlockList;
  } catch (err) {
    logger.error("error in deleting AppConfigModel : ");
    logger.error(err);
    return false;
  }
}
