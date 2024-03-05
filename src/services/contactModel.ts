import logger from "../config/logger";

const { contactModel } = require("../models/ContactsModel");

export async function getContacts(queryParams: any) {
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
  const data = await contactModel
    .find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countContactDocuments(
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
  const data = await contactModel.countDocuments({ ...filterQuery });
  return data;
}

export async function getContactById(id: any, queryParams: any) {
  const data = await contactModel
    .findById(id)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function createContact(data: any) {
  try {
    const contact = new contactModel(data);
    const response = await contact.save();
    return response;
  } catch (err: any) {
    logger.error(`Error in creating contact : ${err}`);
    return false;
  }
}

export async function updateContactById(
  query: any,
  updates: any,
  options: any
) {
  try {
    const updatedData = await contactModel.findByIdAndUpdate(
      query,
      updates,
      options
    );
    return updatedData;
  } catch (err: any) {
    logger.error(`Error in updating : ${err}`);
    return false;
  }
}

export async function deleteOneContactById(id: any) {
  try {
    const myQuery = { _id: id };
    const contactDeletedData = await contactModel.deleteOne(myQuery);
    return contactDeletedData;
  } catch (err: any) {
    logger.error(`Error in deleting one contact : ${err}`);
    return false;
  }
}

export async function deleteManyContacts(query: any) {
  try {
    const contactDeletedData = await contactModel.deleteMany({ ...query });
    return contactDeletedData;
  } catch (err: any) {
    logger.error(`Error in deleting many contact : ${err}`);
    return false;
  }
}

export async function insertManyContacts(query: any) {
  try {
    const contactbulkWriteData = await contactModel.bulkWrite(query);
    return contactbulkWriteData;
  } catch (err: any) {
    logger.error(`Error in deleting many contact : ${err}`);
    return false;
  }
}

export async function getOneContact ( queryParams : any ){
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
  const data = await contactModel
    .findOne({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}
