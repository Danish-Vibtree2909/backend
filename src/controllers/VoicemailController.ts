import Controller from "./Index";
import {IRequest, IResponse} from "../types/IExpress";
import VoiceMailBoxInterface from "../types/VoiceMailBoxTypes";
import { getAllVoicemailRecord , countDocumentOfVoicemailRecord } from "../services/VoicemailModel";
import { findByIdAndDeleteVoicemailBox, findByIdAndUpdateVoicemailBox , getAllVoicemailBox , countDocumentOfVoicemailBox , getByIdVoicemailBox , createVoiceMailBox } from "../services/VoicemailModel";

export default class VoiceMailBoxController extends Controller {
    public constructor(models ? : any) {
        super(models);


        //Voice Mail Box
        this.getAllVoiceMailBoxes = this.getAllVoiceMailBoxes.bind(this);
        this.getVoiceMailBoxById = this.getVoiceMailBoxById.bind(this);
        this.createVoiceMailBox = this.createVoiceMailBox.bind(this);
        this.updateVoiceMailBox = this.updateVoiceMailBox.bind(this);
        this.deleteVoiceMailBox = this.deleteVoiceMailBox.bind(this);

        //Voice Mail Record
        this.getVoiceMailRecordByName = this.getVoiceMailRecordByName.bind(this);
    }

    public async getVoiceMailRecordByName(req: IRequest, res: IResponse) :Promise<any> {

        const authId = req.JWTUser?.authId;
        let caller 
        let startDate : any 
        let endDate : any 
        let voiceMailBoxName 

        if(req.query.Caller !== undefined || req.query.Caller !== null || req.query.Caller !== ''){
            caller = req.query.Caller
        }
        if(req.query.startDate !==null || req.query.startDate !== undefined || req.query.startDate !== '', req.query.startDate !== 'null'){
            startDate = req.query.startDate
        }
        if(req.query.endDate !==null || req.query.endDate !== undefined || req.query.endDate !== '', req.query.endDate !== 'null'){
            endDate = req.query.endDate
        }
        if(req.query.VoiceMailBoxName !==null || req.query.VoiceMailBoxName !== undefined || req.query.VoiceMailBoxName !== '', req.query.VoiceMailBoxName !== 'null'){
            voiceMailBoxName = req.query.VoiceMailBoxName
        }


        const callerFilter = caller ? {'Caller' : {$regex : caller}} : {}
        const voiceMailoxNameFilter = voiceMailBoxName ? {'VoiceMailBoxName': {$regex : voiceMailBoxName}} : { }
        const dateFilter = startDate ? { "createdAt" : {$gte : new Date(startDate) , $lte : new Date(endDate)} } : {};

        const query : any = {
            ...callerFilter,
            ...voiceMailoxNameFilter,
            ...dateFilter,
            limit : req.query.limit,
            sort : req.query.sort,
            fields : req.query.fields,
            offset : req.query.offset,
            populate: req.query.populate,
            AccountSid : authId
        };
        const excludeApiFields = ['page', 'sort', 'limit', 'fields', 'offset', 'populate'];
        excludeApiFields.forEach(e => delete query[e]);
        console.log("Query : ", query)
        const voiceMailRecordData = await getAllVoicemailRecord(query)
        const total = await countDocumentOfVoicemailRecord(query)
        const data = {
            totalCount: total,
            data: voiceMailRecordData
        }
        this.data = data
        this.status = true
        this.message = "Successfully fetched voice mail record"
        this.code = 200
        return res.status(200).json(this.Response())
    }

    public async getAllVoiceMailBoxes(req: IRequest, res: IResponse) :Promise<any> {
        const authId = req.JWTUser?.authId

        const queryParams = { ...req.query , AuthId : authId};

        const voiceMailBoxData = await getAllVoicemailBox(queryParams)
        const total = await countDocumentOfVoicemailBox(queryParams)
        const data = {
            totalCount: total,
            data: voiceMailBoxData
        }
        this.data = data
        this.status = true
        this.message = "Successfully fetched all voice mail boxes"
        this.code = 200
        return res.status(200).json(this.Response())
    }

    public async getVoiceMailBoxById(req: IRequest, res: IResponse) :Promise<any> {
        const voiceMailBoxData = await getByIdVoicemailBox(req.params.id)
        this.data = voiceMailBoxData
        this.status = true
        this.message = "Successfully fetched voice mail box"
        this.code = 200
        return res.status(200).json(this.Response())
    }

    public async createVoiceMailBox(req: IRequest, res: IResponse) :Promise<any> {
        const authId = req.JWTUser?.authId
        const body : VoiceMailBoxInterface = {...req.body , AuthId : authId}
        const voiceMailBoxData = await createVoiceMailBox(body)
        if(!voiceMailBoxData){
            this.data = []
            this.code = 404
            this.message = "Something went wrong!"
            this.status = false

            return res.status(404).json(this.Response())
        }
        this.data = voiceMailBoxData
        this.status = true
        this.message = "Successfully created voice mail box"
        this.code = 201
        return res.status(201).json(this.Response())
    }

    public async updateVoiceMailBox(req: IRequest, res: IResponse) :Promise<any> {
        // const voiceMailBoxData = await VoiceMailBoxModel.findByIdAndUpdate(req.params.id, req.body, {upsert: true})
        const voiceMailBoxData = await findByIdAndUpdateVoicemailBox(req.params.id, req.body, {upsert: false , new : true})

        if(!voiceMailBoxData){
            this.data = []
            this.code = 404
            this.message = "Something went wrong!"
            this.status = false

            return res.status(404).json(this.Response())
        }

        this.data = voiceMailBoxData
        this.status = true
        this.message = "Successfully updated voice mail box"
        this.code = 204
        return res.status(200).json(this.Response())
    }

    public async deleteVoiceMailBox(req: IRequest, res: IResponse) :Promise<any> {
        const voiceMailBoxData = await findByIdAndDeleteVoicemailBox(req.params.id)

        if(!voiceMailBoxData){
            this.data = []
            this.code = 404
            this.message = "Something went wrong!"
            this.status = false

            return res.status(404).json(this.Response())
        }

        this.data = []
        this.status = true
        this.message = "Successfully deleted voice mail box"
        this.code = 200
        return res.status(200).json(this.Response())
    }
}