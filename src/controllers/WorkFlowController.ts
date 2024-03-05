import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import {
  getWorkFlows,
  countWorkFlowDocuments,
  updateWorkFlowWithId,
  deleteWorkFlowById,
  getWorkFlowWithId,
  createWorkFlow,
} from "../services/IvrFlowUIModel";
import { isValidMongoDbObjectId } from "../helper/index";
import WorkFlowType from "../types/ivrFlowType";
import * as config from "../config/index";
import AWS from "aws-sdk";
import BaseException from "../exceptions/BaseException";

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

export default class WorkFlowController extends Controller {
  public constructor(model?: any) {
    super(model);
    this.getWorkFlows = this.getWorkFlows.bind(this);
    this.updateWorkFlowById = this.updateWorkFlowById.bind(this);
    this.deleteWorkFlowById = this.deleteWorkFlowById.bind(this);
    this.getWorkFlowById = this.getWorkFlowById.bind(this);
    this.createWorkFlow = this.createWorkFlow.bind(this);
    this.ConvertTextToSpeech = this.ConvertTextToSpeech.bind(this);
    this.uploadAudio = this.uploadAudio.bind(this);
    this.ConvertSsmlToSpeech = this.ConvertSsmlToSpeech.bind(this);
  }

  public async ConvertSsmlToSpeech(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const OutputFormat: string = req.body.OutputFormat;
    const VoiceId: string = req.body.VoiceId;
    const ssml: string = req.body.ssml;
    const TextType: string = req.body.TextType;

    var input = {
      OutputFormat: OutputFormat,
      Text: ssml,
      TextType: TextType,
      VoiceId: VoiceId,
    };

    let result: string = Math.random().toString(36).substr(2, 25);

    const Polly = new AWS.Polly({
      accessKeyId: config.AWS_ACCESS_KEY_POLLY,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY_POLLY,
      region: config.AWS_REGION_POLLY,
    });
    Polly.synthesizeSpeech(input, async (err, data): Promise<any> => {
      if (err) {
        console.log(err);
        this.status = false;
        this.message = err.message;
        this.code = 200;
        this.data = [];
        return res.json(this.Response());
      }
      if (data.AudioStream instanceof Buffer) {
        const params = {
          Bucket: "vibtreedan/public",
          Key: new Date().toISOString() + "_" + `${result}.mp3`, // The name of the object. For example, 'sample_upload.txt'.
          Body: data.AudioStream,
          ContentType: "audio/mpeg",
        };

        await s3
          .upload(params)
          .promise()
          .then((data) => {
            console.log("data in s3 ", data);
            this.data = [data];
            this.message = "file successfully uploaded.";
            this.status = true;
            this.code = 200;
            return res.json(this.Response());
          })
          .catch((err) => {
            console.log("err 325 : ", err);
            this.status = false;
            this.message = err.message;
            this.code = 200;
            this.data = [];
            return res.json(this.Response());
          });
      }
    });
  }

  public async uploadAudio(req: IRequest | any, res: IResponse): Promise<any> {
    try {
      this.data = [];
      this.status = true;
      let file = req.file;

      if (!file) {
        throw new Error("Audio file is required with 'audio parameter'");
      }

      // check this is audio or not
      if (
        !(
          file.mimetype === "audio/webm" ||
          file.mimetype === "mp3" ||
          file.mimetype === "opus" ||
          file.mimetype === "audio/mpeg" ||
          file.mimetype === "audio/wav"
        )
      ) {
        throw new Error("File is not audio");
      }
      const filename: string = file.originalname;

      // upload it to s3

      const params: any = {
        // Bucket: 'playgreeting/LineForwarding', // The name of the bucket. For example, 'sample_bucket_101'.
        Bucket: "vibtreedan/public",
        // Key: helper.removeAllSpace(new Date().toISOString() + filename), // The name of the object. For example, 'sample_upload.txt'.
        Key: new Date().toISOString() + "_" + filename, // The name of the object. For example, 'sample_upload.txt'.
        Body: file.buffer,
        ContentType: "audio/mpeg",
      };
      const dataS3 = await s3
        .upload(params)
        .promise()
        .then((data) => data)
        .catch((err) => {
          throw new BaseException(
            500,
            "File can not be uploaded!",
            "File_Upload_Error"
          );
        });

      await s3.getSignedUrl("putObject", params);

      this.data = {
        //this is saving the whole location of the file
        fileKey: params.Key,

        //this is saving the key of the file
        fileLink: dataS3.Location,
      };
      this.message = "file successfully uploaded.";
    } catch (error: any) {
      this.message = error.message;
      this.code = 200;
      this.status = false;
    }
    return res.json(this.Response());
  }

  public async ConvertTextToSpeech(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const OutputFormat: string = req.body.OutputFormat;
    const VoiceId: string = req.body.VoiceId;
    const Text: string = req.body.Text;
    const TextType: string = req.body.TextType;

    var input = {
      OutputFormat: OutputFormat,
      Text: Text,
      TextType: TextType,
      VoiceId: VoiceId,
    };

    let result: string = Math.random().toString(36).substr(2, 25);

    const Polly2 = new AWS.Polly({
      accessKeyId: config.AWS_ACCESS_KEY_POLLY,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY_POLLY,
      region: config.AWS_REGION_POLLY,
    });

    Polly2.synthesizeSpeech(input, async (err, data): Promise<any> => {
      if (err) {
        console.log(err);
        this.status = false;
        this.message = err.message;
        this.code = 200;
        this.data = [];
        return res.json(this.Response());
      }
      if (data.AudioStream instanceof Buffer) {
        const params = {
          Bucket: "vibtreedan/public",
          Key: new Date().toISOString() + "_" + `${result}.mp3`, // The name of the object. For example, 'sample_upload.txt'.
          Body: data.AudioStream,
          ContentType: "audio/mpeg",
        };

        await s3
          .upload(params)
          .promise()
          .then((data) => {
            this.data = [data];
            this.message = "file successfully uploaded.";
            this.status = true;
            this.code = 200;
            return res.json(this.Response());
          })
          .catch((err) => {
            console.log(err);
            this.status = false;
            this.message = err.message;
            this.code = 200;
            this.data = [];
            return res.json(this.Response());
          });
      }
    });
  }

  public async getWorkFlows(req: IRequest, res: IResponse) {
    const authId = req.JWTUser?.authId;
    const queryParams = { ...req.query, auth_id: authId };

    const data = await getWorkFlows(queryParams);
    const totalCount = await countWorkFlowDocuments(queryParams);

    const response = {
      data: data,
      totalCount: totalCount,
    };

    this.data = response;
    this.code = 200;
    this.status = true;
    this.message = "Details Fetched!";

    return res.status(200).json(this.Response());
  }

  public async updateWorkFlowById(req: IRequest, res: IResponse) {
    const query = req.params.id;
    const isValidId = isValidMongoDbObjectId(query);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
    const body = { ...req.body }
    delete body.haveCredits
    const updates = { ...body, updatedAt: new Date() };
    const options = { upsert: false };
    const updatedData = await updateWorkFlowWithId(query, updates, options);

    if (updatedData) {
      this.data = [];
      this.status = true;
      this.message = "Updated WorkFlow";
      this.code = 204;

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
  }

  public async deleteWorkFlowById(req: IRequest, res: IResponse) {
    const id = req.params.id;
    const isValidId = isValidMongoDbObjectId(id);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }

    const data = await deleteWorkFlowById(id);
    if (data) {
      this.data = [];
      this.status = true;
      this.code = 204;
      this.message = "Detail Deleted!";

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.message = "Something went wrong";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
  }

  public async getWorkFlowById(req: IRequest, res: IResponse) {
    const id = req.params.id;
    const query = req.query;
    const isValidId = isValidMongoDbObjectId(id);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }

    const data = await getWorkFlowWithId(id, query);

    if (data) {
      this.data = data;
      this.status = true;
      this.code = 200;
      this.message = "Detail Fetched!";

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.status = false;
      this.message = "Something went wrong";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
  }

  public async createWorkFlow(req: IRequest, res: IResponse) {
    const authId = req.JWTUser?.authId;
    const body = req.body;
    const finalBody: WorkFlowType = { ...body, auth_id: authId };

    const data = await createWorkFlow(finalBody);

    if (data) {
      this.data = data;
      this.status = true;
      this.code = 201;
      this.message = "WorkFlow Created!";

      return res.status(201).json(this.Response());
    } else {
      this.data = [];
      this.code = 403;
      this.status = false;
      this.message = "Something went wrong!";

      return res.status(403).json(this.Response());
    }
  }
}
