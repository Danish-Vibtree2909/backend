import VoiceMailBoxModel from "../models/VoiceMailBoxModel";
import VoiceMailRecordModel from "../models/VoiceMailRecordModel";
import logger from "../config/logger";

export async function getAllVoicemailRecord(queryParams: any) {
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
  const data = await VoiceMailRecordModel.find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countDocumentOfVoicemailRecord(queryParams: any) {
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
  const data = await VoiceMailRecordModel.countDocuments({ ...filterQuery });
  return data;
}

export async function getAllVoicemailBox(queryParams: any) {
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
  const data = await VoiceMailBoxModel.find({ ...filterQuery })
    .limit(Number(queryParams.limit))
    .skip(Number(queryParams.offset))
    .sort(queryParams.sort)
    .select(queryParams.fields)
    .populate(queryParams.populate);

  return data;
}

export async function countDocumentOfVoicemailBox(queryParams: any) {
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
  const data = await VoiceMailBoxModel.countDocuments({ ...filterQuery });
  return data;
}

export async function getByIdVoicemailBox(id: any, queryParams?: any) {
  //console.log("Query service : ", filterQuery, queryParams);
  const data = await VoiceMailBoxModel.findById(id);
  return data;
}

export async function createVoiceMailBox(data: any) {
  try {
    const mongoObj = new VoiceMailBoxModel(data);
    const response = await mongoObj.save();
    return response;
  } catch (err) {
    logger.error(`Error in creating VoiceMailBoxModel : ${err}`);
    return err;
  }
}

export async function findByIdAndUpdateVoicemailBox(
  query: any,
  updates: any,
  options?: any
) {
  try {
    const updatedBlockList = await VoiceMailBoxModel.findByIdAndUpdate(
      query,
      updates,
      options
    );
    return updatedBlockList;
  } catch (err) {
    logger.error("error in updating VoiceMailBoxModel : " + err);
    return false;
  }
}

export async function findByIdAndDeleteVoicemailBox(query: any) {
  try {
    const updatedBlockList = await VoiceMailBoxModel.findByIdAndDelete(query);
    return updatedBlockList;
  } catch (err) {
    logger.error("error in deleting VoiceMailBoxModel : " + err);
    return false;
  }
}
