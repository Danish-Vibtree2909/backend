import Controller from "./Index";
import {
  getContactById,
  createContact,
  updateContactById,
  // deleteOneContactById,
  deleteManyContacts,
  insertManyContacts,
} from "../services/contactModel";
import { isValidMongoDbObjectId } from "../helper/index";
import { IRequest, IResponse } from "../types/IExpress";
import { uploadFile , downloadFile} from "../middleware/fileUploadToS3";
import * as config from "../config/index";
import mime from 'mime-types'
import {Readable} from 'stream'
import {findOneAndUpdateSmsConversatio} from '../services/SMSConversationModel'

export default class ContactController extends Controller {
  public constructor(models?: any) {
    super(models);
    this.getContactById = this.getContactById.bind(this);
    this.createContactFunction = this.createContactFunction.bind(this);
    this.updateOnlyBodyOfContact = this.updateOnlyBodyOfContact.bind(this);
    this.updateImageOfContact = this.updateImageOfContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
    this.deleteManyContacts = this.deleteManyContacts.bind(this)
    this.insertManyContacts = this.insertManyContacts.bind(this)
    this.downloadContactImage = this.downloadContactImage.bind(this)
  }

  public async downloadContactImage(req: IRequest | any , res: IResponse): Promise<any> {
    let fileLocation = req.query.fileLocation
    if(!fileLocation){
      return res.status(403).send("Please provide details!")
    }
    fileLocation = fileLocation.toString()
    const fileData = await downloadFile(config.AWS_BUCKET_NAME + "/Contacts", fileLocation)

    const file = new Readable({
      read() {
        this.push(fileData.Body)
        this.push(null)
      }
    });

    const fileNameArr = fileLocation.split("_");
    const filename = fileNameArr[fileNameArr.length - 1];
    const fileExtensionArr = fileLocation.split(".");
    const fileType = fileExtensionArr[fileExtensionArr.length - 1];

    res.setHeader('Content-Disposition','attachment: filename="'+filename+'"');
    //@ts-ignore
    res.setHeader('Content-Type',  mime.lookup(fileType));
    file.pipe(res)
   
    return res;

  }

  formatTheQueryToCheckDuplicatesBeforeInsert = (data : any) =>{
    //console.log("Data : ", data)
    const tempArr = data.map((doc : any )=>{

      let tempObj = { 
        updateOne :
        {
           "filter" : { phoneNumber: doc.phoneNumber , AccountSid : doc.AccountSid }, // the 'deduplication' filter, can be any property, not just _id
           "update" : { $setOnInsert : { ...doc }},
           "upsert" : true
        }
      }

      return tempObj

    })

    //console.log("Formatted Array : ", tempArr)

    return tempArr
  }

  public async insertManyContacts (req : IRequest , res :IResponse) :Promise<any>{
    const arrayOfChildCalls : any  = req.body
    const tempArr = this.formatTheQueryToCheckDuplicatesBeforeInsert(arrayOfChildCalls)
    console.log("Temp Array : ", tempArr)
    const data : any = await insertManyContacts(tempArr)

    if(data){
      this.data = data
      this.status = true
      this.message = 'Successfully added the contacts'
      this.code = 200

      return res.status(200).json(this.Response())
    }else{
      this.data = []
      this.status = false
      this.code = 404
      this.message = 'No Conatacts added!'
      return res.status(404).json(this.Response())
    }
    
  }

  public async deleteManyContacts ( req : IRequest , res : IResponse ): Promise <any>{
    const body : any = req.body;
    const authId = req.JWTUser?.authId
    console.log("Body : ", body)
    const query = { ...body , AccountSid : authId }
    const responseAfterDeleting = await deleteManyContacts(query)
    console.log("Response : ", responseAfterDeleting)

    this.data = responseAfterDeleting.deletedCount
    this.message = "Contacts Deleted"
    this.status = true

    return res.json(this.Response())
  }

  public async deleteContact(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id;
    const isValidId = isValidMongoDbObjectId(id);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }

    const update = { 
      isDeleted : true
    }

    const options = {
      "upsert" : false
    }

    // const deletedData = await deleteOneContactById(id);
     const deletedData = await updateContactById(id , update , options);
    

    if (deletedData) {
      this.data = [];
      this.code = 200;
      this.status = true;
      this.message = "Contact deleted!";

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.code = 404;
      this.status = false;
      this.message = "Contact not deleted!";

      return res.status(404).json(this.Response());
    }

    
  }

  public async updateImageOfContact(
    req: IRequest | any,
    res: IResponse
  ): Promise<any> {
    const id = req.params.id;
    const isValidId = isValidMongoDbObjectId(id);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }

    let fileS3Data = null;
    if (req.file) {
      console.log("file is present");
      fileS3Data = await uploadFile(
        config.AWS_BUCKET_NAME + "/Contacts",
        req.file
      );

      fileS3Data = fileS3Data.key.split("Contacts/")[1];
    }

    let photoObj = fileS3Data ? { photo: fileS3Data } : {};
    console.log("Photo Obj : ", photoObj);
    const options = { upsert: false };
    const updatedData = await updateContactById(id, photoObj, options);

    if (updatedData) {
      this.data = [];
      this.code = 204;
      this.status = true;
      this.message = "Photo of contact updated!";

      return res.status(200).json(this.Response());
    } else {
      this.data = [];
      this.code = 404;
      this.status = false;
      this.message = "Photo of contact not updated!";

      return res.status(404).json(this.Response());
    }

    
  }

  public async updateOnlyBodyOfContact(
    req: IRequest,
    res: IResponse
  ): Promise<any> {
    const id = req.params.id;
    const isValidId = isValidMongoDbObjectId(id);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }

    const body = { ...req.body };
    const options = { upsert: false , new : true };
    const updatedData = await updateContactById(id, body, options);
    const queryForConversation = { contactId : id}
    const updateForConversation = { $set : { contactName : `${req.body.firstName ? req.body.firstName : updatedData.firstName} ${req.body.lastName ? req.body.lastName : updatedData.lastName}`}}
    const optionForConversation = { upsert : false}
    findOneAndUpdateSmsConversatio( queryForConversation , updateForConversation , optionForConversation)
    if (updatedData) {
      this.data = [];
      this.status = true;
      this.message = "Contact updated";
      this.code = 204;

      return res.status(201).json(this.Response());
    } else {
      this.data = [];
      this.status = true;
      this.message = "Contact not updated";

      return res.status(404).json(this.Response());
    }
  }

  public async getContactById(req: IRequest, res: IResponse): Promise<any> {
    const id = req.params.id;
    const isValidId = isValidMongoDbObjectId(id);

    if (!isValidId) {
      this.data = [];
      this.status = false;
      this.message = "Please check the id!";
      this.code = 403;

      return res.status(403).json(this.Response());
    }
    const queryParams = { ...req.query };
    const contactData = await getContactById(id, queryParams);

    this.data = contactData ? contactData : {};
    this.status = true;
    this.code = 200;
    this.message = "Successfully found the available Contact.";
    return res.status(200).json(this.Response());
  }

  public async createContactFunction(
    req: IRequest | any,
    res: IResponse
  ): Promise<any> {
    let fileS3Data = null;
    const data = JSON.parse(req.body.payload);

    if (!data.firstName) {
      const responseToSend = {
        status: false,
        code: 403,
        message: "Provide first name!",
        data: [],
      };

      return res.status(403).json(responseToSend);
    }

    if (!data.phoneNumber) {
      const responseToSend = {
        status: false,
        code: 403,
        message: "Provide phone number!",
        data: [],
      };

      return res.status(403).json(responseToSend);
    }

    const AccountSid = req.JWTUser?.authId;
    const user_id = req.JWTUser?._id;

    if (req.file) {
      fileS3Data = await uploadFile(
        config.AWS_BUCKET_NAME + "/Contacts",
        req.file
      );
    }

    let exactUrl;
    if (fileS3Data !== null && fileS3Data !== undefined) {
      exactUrl = fileS3Data.key.split("Contacts/")[1] || "";
      console.log("exactUrl : ", exactUrl);
    }

    if(data.CustomVariables){
      let customeVariable = JSON.parse(data.CustomVariables)
      // customeVariable = customeVariable.filter((item: any)=>{
      //   return delete item["_id"]
      // })
      // console.log("customeVariable : ", customeVariable)
      data.CustomVariables = customeVariable.length > 0  ?  customeVariable : []
      // console.log("customeVariable : ", data.CustomVariables)
    }

    const response = await createContact({
      ...data,
      AccountSid: AccountSid,
      user_id: user_id,
      photo: exactUrl,
    });

    if (response) {
      const responseToSend = {
        status: true,
        code: 201,
        message: "Contact created!",
        data: response,
      };

      return res.status(201).json(responseToSend);
    } else {
      const responseToSend = {
        status: false,
        code: 404,
        message: "Contact not created!",
        data: [],
      };

      return res.status(404).json(responseToSend);
    }
  }
}
