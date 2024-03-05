"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Index_1 = __importDefault(require("./Index"));
const contactModel_1 = require("../services/contactModel");
const index_1 = require("../helper/index");
const fileUploadToS3_1 = require("../middleware/fileUploadToS3");
const config = __importStar(require("../config/index"));
const mime_types_1 = __importDefault(require("mime-types"));
const stream_1 = require("stream");
const SMSConversationModel_1 = require("../services/SMSConversationModel");
class ContactController extends Index_1.default {
    constructor(models) {
        super(models);
        this.getContactById = this.getContactById.bind(this);
        this.createContactFunction = this.createContactFunction.bind(this);
        this.updateOnlyBodyOfContact = this.updateOnlyBodyOfContact.bind(this);
        this.updateImageOfContact = this.updateImageOfContact.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
        this.deleteManyContacts = this.deleteManyContacts.bind(this);
        this.insertManyContacts = this.insertManyContacts.bind(this);
        this.downloadContactImage = this.downloadContactImage.bind(this);
    }
    async downloadContactImage(req, res) {
        let fileLocation = req.query.fileLocation;
        if (!fileLocation) {
            return res.status(403).send("Please provide details!");
        }
        fileLocation = fileLocation.toString();
        const fileData = await (0, fileUploadToS3_1.downloadFile)(config.AWS_BUCKET_NAME + "/Contacts", fileLocation);
        const file = new stream_1.Readable({
            read() {
                this.push(fileData.Body);
                this.push(null);
            }
        });
        const fileNameArr = fileLocation.split("_");
        const filename = fileNameArr[fileNameArr.length - 1];
        const fileExtensionArr = fileLocation.split(".");
        const fileType = fileExtensionArr[fileExtensionArr.length - 1];
        res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '"');
        //@ts-ignore
        res.setHeader('Content-Type', mime_types_1.default.lookup(fileType));
        file.pipe(res);
        return res;
    }
    formatTheQueryToCheckDuplicatesBeforeInsert = (data) => {
        //console.log("Data : ", data)
        const tempArr = data.map((doc) => {
            let tempObj = {
                updateOne: {
                    "filter": { phoneNumber: doc.phoneNumber, AccountSid: doc.AccountSid },
                    "update": { $setOnInsert: { ...doc } },
                    "upsert": true
                }
            };
            return tempObj;
        });
        //console.log("Formatted Array : ", tempArr)
        return tempArr;
    };
    async insertManyContacts(req, res) {
        const arrayOfChildCalls = req.body;
        const tempArr = this.formatTheQueryToCheckDuplicatesBeforeInsert(arrayOfChildCalls);
        console.log("Temp Array : ", tempArr);
        const data = await (0, contactModel_1.insertManyContacts)(tempArr);
        if (data) {
            this.data = data;
            this.status = true;
            this.message = 'Successfully added the contacts';
            this.code = 200;
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.status = false;
            this.code = 404;
            this.message = 'No Conatacts added!';
            return res.status(404).json(this.Response());
        }
    }
    async deleteManyContacts(req, res) {
        const body = req.body;
        const authId = req.JWTUser?.authId;
        console.log("Body : ", body);
        const query = { ...body, AccountSid: authId };
        const responseAfterDeleting = await (0, contactModel_1.deleteManyContacts)(query);
        console.log("Response : ", responseAfterDeleting);
        this.data = responseAfterDeleting.deletedCount;
        this.message = "Contacts Deleted";
        this.status = true;
        return res.json(this.Response());
    }
    async deleteContact(req, res) {
        const id = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const update = {
            isDeleted: true
        };
        const options = {
            "upsert": false
        };
        // const deletedData = await deleteOneContactById(id);
        const deletedData = await (0, contactModel_1.updateContactById)(id, update, options);
        if (deletedData) {
            this.data = [];
            this.code = 200;
            this.status = true;
            this.message = "Contact deleted!";
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.code = 404;
            this.status = false;
            this.message = "Contact not deleted!";
            return res.status(404).json(this.Response());
        }
    }
    async updateImageOfContact(req, res) {
        const id = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
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
            fileS3Data = await (0, fileUploadToS3_1.uploadFile)(config.AWS_BUCKET_NAME + "/Contacts", req.file);
            fileS3Data = fileS3Data.key.split("Contacts/")[1];
        }
        let photoObj = fileS3Data ? { photo: fileS3Data } : {};
        console.log("Photo Obj : ", photoObj);
        const options = { upsert: false };
        const updatedData = await (0, contactModel_1.updateContactById)(id, photoObj, options);
        if (updatedData) {
            this.data = [];
            this.code = 204;
            this.status = true;
            this.message = "Photo of contact updated!";
            return res.status(200).json(this.Response());
        }
        else {
            this.data = [];
            this.code = 404;
            this.status = false;
            this.message = "Photo of contact not updated!";
            return res.status(404).json(this.Response());
        }
    }
    async updateOnlyBodyOfContact(req, res) {
        const id = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const body = { ...req.body };
        const options = { upsert: false, new: true };
        const updatedData = await (0, contactModel_1.updateContactById)(id, body, options);
        const queryForConversation = { contactId: id };
        const updateForConversation = { $set: { contactName: `${req.body.firstName ? req.body.firstName : updatedData.firstName} ${req.body.lastName ? req.body.lastName : updatedData.lastName}` } };
        const optionForConversation = { upsert: false };
        (0, SMSConversationModel_1.findOneAndUpdateSmsConversatio)(queryForConversation, updateForConversation, optionForConversation);
        if (updatedData) {
            this.data = [];
            this.status = true;
            this.message = "Contact updated";
            this.code = 204;
            return res.status(201).json(this.Response());
        }
        else {
            this.data = [];
            this.status = true;
            this.message = "Contact not updated";
            return res.status(404).json(this.Response());
        }
    }
    async getContactById(req, res) {
        const id = req.params.id;
        const isValidId = (0, index_1.isValidMongoDbObjectId)(id);
        if (!isValidId) {
            this.data = [];
            this.status = false;
            this.message = "Please check the id!";
            this.code = 403;
            return res.status(403).json(this.Response());
        }
        const queryParams = { ...req.query };
        const contactData = await (0, contactModel_1.getContactById)(id, queryParams);
        this.data = contactData ? contactData : {};
        this.status = true;
        this.code = 200;
        this.message = "Successfully found the available Contact.";
        return res.status(200).json(this.Response());
    }
    async createContactFunction(req, res) {
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
            fileS3Data = await (0, fileUploadToS3_1.uploadFile)(config.AWS_BUCKET_NAME + "/Contacts", req.file);
        }
        let exactUrl;
        if (fileS3Data !== null && fileS3Data !== undefined) {
            exactUrl = fileS3Data.key.split("Contacts/")[1] || "";
            console.log("exactUrl : ", exactUrl);
        }
        if (data.CustomVariables) {
            let customeVariable = JSON.parse(data.CustomVariables);
            // customeVariable = customeVariable.filter((item: any)=>{
            //   return delete item["_id"]
            // })
            // console.log("customeVariable : ", customeVariable)
            data.CustomVariables = customeVariable.length > 0 ? customeVariable : [];
            // console.log("customeVariable : ", data.CustomVariables)
        }
        const response = await (0, contactModel_1.createContact)({
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
        }
        else {
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
exports.default = ContactController;
//# sourceMappingURL=ContactController.js.map