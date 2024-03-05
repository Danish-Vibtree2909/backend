import AWS from 'aws-sdk';
import BaseException from '../exceptions/BaseException';
import * as config from "../config/index";

const s3 = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: 'eu-central-1'
});

async function uploadFile(bucketName: string, file : any ): Promise<any> {
    console.log("cred ", config.AWS_ACCESS_KEY , config.AWS_SECRET_ACCESS_KEY)
    const random = Math.random().toString(36).substr(2, 25);
    const params = {
        Bucket: bucketName,
        Key: `${random}_${file.originalname}`,
        Body: file.buffer
    };
    console.log("params : ", params)
    return await s3
        .upload(params)
        .promise()
        .then((data) => data
        )
        .catch((err) => {
            console.log(err)
            throw new BaseException(500, "File can not be uploaded!", "File_Upload_Error");
        });

}

async function downloadFile(bucketName: string, filePath: string): Promise<any> {

    const params = {
        Bucket: bucketName,
        Key: filePath
    };

    return await s3
        .getObject(params)
        .promise()
        .then((data) => data)
        .catch((err) => {
            console.log(err)
            throw new BaseException(500, "File can not be downloaded!", "File_Download_Error");
        });

}

async function deleteFile(bucketName: string, filePath: string): Promise<any> {
    
    const params = {
        Bucket: bucketName,
        Key: filePath
    };

    return await s3
        .deleteObject(params)
        .promise()
        .then((data) => data)
        .catch((err) => {
            console.log(err)
            throw new BaseException(500, "File can not be deleted!", "File_Delete_Error");
        });

}

export { s3 , uploadFile , downloadFile , deleteFile}