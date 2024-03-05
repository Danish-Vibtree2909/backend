import AWS from 'aws-sdk';
declare const s3: AWS.S3;
declare function uploadFile(bucketName: string, file: any): Promise<any>;
declare function downloadFile(bucketName: string, filePath: string): Promise<any>;
declare function deleteFile(bucketName: string, filePath: string): Promise<any>;
export { s3, uploadFile, downloadFile, deleteFile };
//# sourceMappingURL=fileUploadToS3.d.ts.map