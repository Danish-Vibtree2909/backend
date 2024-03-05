const { groupModel } = require("../models/ContactsModel");
import logger from "../config/logger";

export async function getGroups(queryParams: any) {
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
  const data = await groupModel
    .find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countGroupsDocuments(
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
  const data = await groupModel.countDocuments({ ...filterQuery });
  return data;
}

export async function getGroupsById(id: any, queryParams?: any) {
  const data = await groupModel
    .findById(id)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function createGroups(data: any) {
  try {
    const contact = new groupModel(data);
    const response = await contact.save();
    return response;
  } catch (err: any) {
    logger.error(`Error in groupModel contact : ${err}`);
    return false;
  }
}

export async function updateGroupsById(query: any, updates: any, options: any) {
  try {
    const updatedData = await groupModel.findByIdAndUpdate(
      query,
      updates,
      options
    );
    return updatedData;
  } catch (err: any) {
    logger.error(`Error in groupModel update : ${err}`);
    return false;
  }
}

export async function deleteOneGroupsById(id: any) {
  try {
    const myQuery = { _id: id };
    const contactDeletedData = await groupModel.deleteOne(myQuery);
    return contactDeletedData;
  } catch (err: any) {
    logger.error(`Error in deleting one group : ${err}`);
    return false;
  }
}
