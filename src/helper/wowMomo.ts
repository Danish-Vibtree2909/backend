import logger from '../config/logger';
import request from "request";

const httpClient = request;

export interface SendFeedback {
    business_uuid: string;
    branch: number;
    reviewer_name: string;
    contact_number: string;
    email: string;
    review_time: string;
    rating: number;
    review_text: string;
    review_tags: string;
    remarks: string;
  }

export async function sendFeedbackFormData ( data : SendFeedback){
    const link = 'https://api.famepilot.com/reviews/partner-feedback/'
    var options = {
    'method': 'POST',
    'url': link,
    'headers': {
    },
    formData: {...data}
    };

    logger.info('Option in Sending FeedBack : ' + JSON.stringify(options))
    return new Promise(( resolve : any , reject : any)=>{
        httpClient( options ,( error , response , body)=>{
            if(error){
                logger.error("error in sending feedback : " + error);
                reject(error);
            }
            logger.info('Response in sending FeedBack : ' + body)
            resolve(body)
        })
    })

}

export async function sendFeedbackJson ( data : SendFeedback ){

    const link = 'https://api.famepilot.com/reviews/partner-feedback/'
    const options = {
    'method': 'POST',
    'url': link,
    'headers': {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({...data})
    };
    logger.info('Option in Sending FeedBack : ' + JSON.stringify(options))

    return new Promise(( resolve : any , reject : any)=>{
        httpClient( options ,( error , response , body)=>{
            if(error){
                logger.error("error in sending feedback : " + error);
                reject(error);
            }
            logger.info('Response in sending FeedBack : ' + body)
            resolve(body)
        })
    })
}