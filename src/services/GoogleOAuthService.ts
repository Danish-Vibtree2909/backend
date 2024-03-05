import logger from '../config/logger';
import * as config from '../config/index';
import request from 'request';
const httpClient = request

interface GoogleTokensResult {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
  }

  export async function getGoogleOAuthTokens({
    code,
  }: {
    code: string;
  }): Promise<GoogleTokensResult> {
    const url = "https://oauth2.googleapis.com/token";
    
    console.log("Code receive to fetch user access_token : ", code)
    const values = {
      code,
      client_id: config.GOOGLE_CLIENT_ID,
      client_secret: config.GOOGLE_CLIENT_SECRET,
      redirect_uri: config.GOOGEL_OAUTH_REDIRECT_URI,
      grant_type: "authorization_code",
    };
  
    const options = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(values).toString(),
    };
  

  
    return new Promise((resolve: any, reject: any) => {
      httpClient(options, (err: Error, res: any, body: any) => {
        if (err) {
          logger.error("Error in get google oauth token : " + err);
          throw new Error(err.message);
        }

        const jsonBody = JSON.parse(body);
        resolve(jsonBody);
      });
    });
  }
  
  interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
  }

  export async function getGoogleUser({
    id_token ,
    access_token,
  }:{    
    id_token : string ,
    access_token : string
}): Promise<GoogleUserResult> {

    const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    const options = {
        method : 'get',
        url : url,
        headers: {
            Authorization: `Bearer ${id_token}`,
        },
    }

    return new Promise((resolve : any , reject : any )=>{
        httpClient.get(options , (err : Error , res : any , body : any )=>{
            if(err){
                logger.error('Error in get google user : ' + err)
                throw new Error(err.message)
            }
            const jsonBody : GoogleUserResult = JSON.parse(body)
            resolve(jsonBody)
        })
    })
  }