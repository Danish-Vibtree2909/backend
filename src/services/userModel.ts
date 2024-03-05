import userModel from '../models/UserPermissionUserModel';
import logger from "../config/logger";
import { FilterQuery, UpdateQuery } from 'mongoose';
import UserPermissionUserInterface from '../types/userPermissionUser';

export async function getUser(queryParams: any) {
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
    const data = await userModel
      .find({...filterQuery})
      .limit(Number(queryParams.limit))
      .skip(Number(queryParams.offset))
      .sort(queryParams.sort)
      .select(queryParams.fields)
      .populate(queryParams.populate);
  
    return data;
  }
  
  export async function getDetailById( id: any , queryParams?: any ) {
    //console.log("Query service : ", filterQuery, queryParams);
    const data = await userModel
      .findById(id)
      .select(queryParams?.fields)
      .populate(queryParams?.populate);
  
    return data;
  }

  export async function countUserDocuments(queryParams: any, userDetails?: any) {
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
    const data = await userModel.countDocuments({...filterQuery});
    return data;
  }


  export async function getSingleUser(queryParams: { phone?: any; email?: any; populate?: any; }) {
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
    const data = await userModel
      .findOne({...filterQuery})
      .populate(queryParams.populate);
  
    return data;
  }

  export async function findOneAndUpdateUser (query: FilterQuery<UserPermissionUserInterface> , updates: UpdateQuery<UserPermissionUserInterface> , options: any){
    try{
      const response = await userModel.findOneAndUpdate(query , updates , options)
      return response
    }catch(err){
      logger.error('Error in updating user : '+ err)
      return false
    }

  }

  export async function createUser ( data : any ){
    try{
      const response = new userModel(data)
      const userData = await response.save()
      return  userData
    }catch(err){
      logger.error(`Error in creating user : ${err}`)
      return false
    }
  }

  export async function deleteUser ( query : any ){
    try{
      const response = await userModel.deleteOne(query)
      return response
    }catch(err){
      logger.error('Error in deleting user : ' + err)
      return false
    }
  }