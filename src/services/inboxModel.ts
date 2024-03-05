import logger from "../config/logger";
import InboxModel from "../models/InboxModel";

export async function getInboxes(queryParams: any) {
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
  const data = await InboxModel
    .find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countInboxDocuments(
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
  const data = await InboxModel.countDocuments({ ...filterQuery });
  return data;
}

export async function getInboxById(id: any, queryParams: any) {
  const data = await InboxModel
    .findById(id)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function createInbox(data: any) {
  try {
    const Inbox = new InboxModel(data);
    const response = await Inbox.save();
    return response;
  } catch (err: any) {
    logger.error(`Error in creating Inbox : ${err}`);
    return false;
  }
}

export async function updateInboxById(
  query: any,
  updates: any,
  options: any
) {
  try {
    const updatedData = await InboxModel.findByIdAndUpdate(
      query,
      updates,
      options
    );
    return updatedData;
  } catch (err: any) {
    logger.error(`Error in updating Inbox : ${err}`);
    return false;
  }
}

export async function deleteOneInboxById(id: any) {
  try {
    const myQuery = { _id: id };
    const contactDeletedData = await InboxModel.deleteOne(myQuery);
    return contactDeletedData;
  } catch (err: any) {
    logger.error(`Error in deleting one Inbox : ${err}`);
    return false;
  }
}

export async function getOneInbox(queryParams: any) {
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
  const data = await InboxModel
    .findOne({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}
