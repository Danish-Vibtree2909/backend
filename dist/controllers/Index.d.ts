import IResponse from '../types/Response';
import * as AWS from 'aws-sdk';
/**
 * It the parenf class of all controller
 * @class COntroller
 */
export default class Controller {
    code: number;
    status: boolean;
    successMessage: string;
    errorMessage: string;
    message: string;
    data: any;
    count: number;
    constructor(model?: any);
    s3Client(): AWS.S3;
    /**
     * It will return the api response
     * @returns IResponse
     * */
    Response(): IResponse;
}
//# sourceMappingURL=Index.d.ts.map