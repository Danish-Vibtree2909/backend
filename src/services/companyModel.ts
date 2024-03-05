import company from '../models/companyModel';
import logger from "../config/logger";

export async function createCompany(data: any) {
    try {
      const companyDetail = new company(data);
      const response = await companyDetail.save();
      return response;
    } catch (err: any) {
      logger.error(`Error in creating company : ${err}`);
      return false;
    }
  }