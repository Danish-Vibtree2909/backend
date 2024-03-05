import IResponse from '../types/Response'
import * as AWS from 'aws-sdk'
/**
 * It the parenf class of all controller
 * @class COntroller
 */

export default class Controller {
  public code : number = 200
  public status : boolean = true

  public successMessage : string = 'Request successfully completed';

  public errorMessage :string = 'Requst failed.'

  public message = 'Request successfully completed'

  public data : any = []

  public count :number ;

  constructor (model?:any) {
    this.Response = this.Response.bind(this)
    this.s3Client = this.s3Client.bind(this)

    this.code = 200
    this.status = true
    this.message = 'Request successfully completed.'
    this.data = []
    this.count=0
  }

  public s3Client () : AWS.S3 {
    return new AWS.S3({
      accessKeyId: 'AKIA2MTCLJCG3DK7TOER',
      secretAccessKey: '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'
    })
  }

  /**
   * It will return the api response
   * @returns IResponse
   * */
  public Response () : IResponse {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data: this.data? this.data: []
    }
  }
}
