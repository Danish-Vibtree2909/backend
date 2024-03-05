import LeadModel from '../models/LeadModel';
import logger from '../config/logger';

export async function createLead ( data : any ){
    try {
        const mongoObj = new LeadModel(data);
        const response = await mongoObj.save();
        return response;
      } catch (err) {
        logger.error(`Error in creating LeadModel : ${err}`);
        return false;
      }
}

export async function deleteManyLead(query: any) {
    try {
      const updatedLeadModel = await LeadModel.deleteMany(query);
      return updatedLeadModel;
    } catch (err) {
      logger.error("error in deleting LeadModel : " + err);
      return false;
    }
}

export async function findOnendUpdateLead(query: any, updates: any , options?:any ) {
    try {
      const updatedLead = await LeadModel.findOneAndUpdate(
        query,
        updates,
        options
      );
      return updatedLead;
    } catch (err) {
      logger.error("error in updating LeadModel : " + err);
      return false;
    }
}

