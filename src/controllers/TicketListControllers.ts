import Controller from "./Index";
import {IRequest , IResponse} from '../types/IExpress';
import TicketTypes from '../types/TicketTypes';
import TicketListModel from "../models/TicketListModel";
import AppConfig from '../models/AppConfigModel';
import Gupshup from '../services/GupShup/index';
import Store from '../models/StoreModel';
import {buildQueryFromCustomVariable} from '../helper/index';
import {SendFeedback ,sendFeedbackFormData} from '../helper/wowMomo';
import * as config from '../config/index';
import moment from 'moment';

interface authenticationForGupshupAndCustomerDetails  {
    user_id : string;
    password : string;
    message : string ;
    phone_number : string;
    buttonUrlParam ?: string;
}

interface payloadForOptent {
    user_id : string;
    password : string;
    phone_number : string;
    message ?: string;
}

export default class TicketListControllers extends Controller{
    public constructor (model ?: any){
        super(model);
        this.postTickets = this.postTickets.bind(this)
        this.patchTickets = this.patchTickets.bind(this)
        this.getAllTickets = this.getAllTickets.bind(this)
        this.getTicketsById = this.getTicketsById.bind(this)
        this.addVoiceToConversation = this.addVoiceToConversation.bind(this)
        this.fetchTicketsForGupShup = this.fetchTicketsForGupShup.bind(this)
    }

    public async fetchTicketsForGupShup ( req : IRequest | any , res : IResponse) : Promise<any>{
        const number = req.query.number
        const status = req.query.status

        const query = {...req.query}
        const excludeApiFields = ['page', 'sort', 'limit', 'fields', 'offset', 'populate' , 'user_id' , 'customVariable', 'nestedPopulate' , 'status' , 'startDate' , 'endDate' , 'AccountSid'];
        excludeApiFields.forEach(e => delete query[e]);

        if(!number){
            this.code = 404
            this.status = false
            this.data = []
            this.message = 'Please provide number!'
            return res.status(404).json(this.Response())
        }

        if(!status){
            this.code = 404
            this.status = false
            this.data = []
            this.message = 'Please provide status!'
            return res.status(404).json(this.Response())
        }

        const queryForStore : any = {$or : [{cityHead : number},{storeManager : number}]}
        const storeDetails = await Store.findOne(queryForStore)
        if(!storeDetails){
            this.status = false
            this.code = 404
            this.message = 'Number not found!'
            this.data = []

            return res.status(404).json(this.Response())
        }
        console.log("Store Person Details , ", storeDetails)
        const city = storeDetails.city
        const zone = storeDetails.zone
        const payload = buildQueryFromCustomVariable(JSON.stringify({"City":city, "Zone":zone}))

        if(payload){
            const queryForOpenTickets = {...payload , "status.name":status}
            const tickets = await TicketListModel.find(queryForOpenTickets , {ticket_id : 1 , status : 1}).limit(Number(req.query.limit)).skip(Number(req.query.offset)).sort(req.query.sort).select(req.query.fields).populate(req.query.populate)

            this.status = true
            this.message = 'Tickets fetched!'
            this.code = 200
            this.data = tickets
 
            return res.status(200).json(this.Response())
        }

        this.data = []
        this.message = 'Something goes wrong!'
        this.status = false
        this.code = 400

        return res.status(400).json(this.Response())
     }

    public async addVoiceToConversation(req : IRequest , res : IResponse) : Promise<any>{
        console.log("ticket id : ", req.query.id)
        console.log("Conversations : ", req.body.conversations)
        const id = req.query.id
        const conversations : any = req.body.conversations
        let updates 

        if(conversations.voice){
            updates = {
                $push :{
                    "conversations.voice" :{
                        $each : [conversations.voice],
                        $position : 0
                    }
                }
            }
        }else if(conversations.whatsapp){
            updates = {
                $push :{
                    "conversations.whatsapp" :{
                        $each : [conversations.whatsapp],
                        $position : 0
                    }
                }
            }
        }else if(conversations.telegram){
            updates = {
                $push :{
                    "conversations.telegram" :{
                        $each : [conversations.telegram],
                        $position : 0
                    }
                }
            }
        }else if(conversations.viber){
            updates = {
                $push :{
                    "conversations.viber" :{
                        $each : [conversations.viber],
                        $position : 0
                    }
                }
            }
        }else if(conversations.messenger){
            updates = {
                $push :{
                    "conversations.messenger" :{
                        $each : [conversations.messenger],
                        $position : 0
                    }
                }
            }
        }else{
            this.data = []
            this.message = "No Conversation Found"
            this.status = false

            return res.json(this.Response())
        }

        const query = {_id : id}
        const response = await TicketListModel.updateOne(query , updates)
        console.log("Response : ", response)
        this.data = []
        this.message = "Added to conversation"
        this.status = true

        return res.json(this.Response())
    }

    public async getTicketsById(req:IRequest , res: IResponse):Promise<any>{
        const id = req.params.id
        const foundDetailsOfBlockList = await TicketListModel.findById(id)
        this.data = foundDetailsOfBlockList
        this.status = true
        this.message = 'Found Details'

        return res.json(this.Response())
    }

    buildQueryFromCustomVariable = (query : string) =>{
        let dbQuery = {}
        try{
            const jsonQuery = JSON.parse(query)
            
            let keys = Object.keys(jsonQuery)
            let values = Object.values(jsonQuery)
            console.log("Keys : ", keys)
            console.log("Values : ", values)
            // { "status.name" : {$in : [...status]} }
            dbQuery = {"CustomVariables.name" : {$in : [...keys]} , "CustomVariables.selected_value" : {$in :[...values]}}
            console.log("DB-Query : ", dbQuery)
            return dbQuery
        }catch(err){
            console.log("Error : ", err)
            return dbQuery
        }

    }

    public async getAllTickets(req: IRequest | any , res : IResponse) : Promise<any>{
        const query = {...req.query}
        const AccountSid = req.JWTUser?.authId
        const excludeApiFields = ['page', 'sort', 'limit', 'fields', 'offset', 'populate' , 'user_id' , 'customVariable', 'nestedPopulate' , 'status' , 'startDate' , 'endDate' , 'AccountSid'];
        excludeApiFields.forEach(e => delete query[e]);
        let user_id
        let status
        let startDate : any  
        let endDate : any = new Date()
        let customVariable : any 
        if(req.query.user_id !== undefined && req.query.user_id !== null && req.query.user_id !== ''){
            user_id = req.query.user_id
        }
        if(req.query.status !== undefined && req.query.status !== null && req.query.status !== ''){
            let tempStatus : any = req.query.status
            status = tempStatus.split(",")
        }
        if(req.query.startDate !==null || req.query.startDate !== undefined || req.query.startDate !== ''){
            startDate = req.query.startDate
        }
        if(req.query.endDate !==null || req.query.endDate !== undefined || req.query.endDate !== ''){
            endDate = req.query.endDate
        }
        if(req.query.customVariable !==null || req.query.customVariable !== undefined || req.query.customVariable !== ''){
            customVariable = req.query.customVariable
        }

        console.log("CustomeVariable : ", customVariable)
        const customeVariableFilter = this.buildQueryFromCustomVariable(customVariable)
        const accountSidFilter = AccountSid ? {"AccountSid" : AccountSid} : {}
        const dateFilter = startDate ? { "createdAt" : {$gte : new Date(startDate) , $lte : new Date(endDate)} } : {};
        const statusFilter = status ? { "status.name" : {$in : [...status]} } :{}
        const useridFilter = user_id ? {user_id : {$in : user_id}} : {}
        const finalQuery = {
            ...accountSidFilter,
            ...query,
            ...useridFilter,
            ...statusFilter,
            ...dateFilter,
            ...customeVariableFilter
        }
        console.log("status : ", statusFilter , status)
        console.log("Query : ", finalQuery)
        const userStatusDetails = await TicketListModel.find(finalQuery).limit(Number(req.query.limit)).skip(Number(req.query.offset)).sort(req.query.sort).select(req.query.fields).populate(req.query.populate).populate({path:'conversations', populate:{path : 'voice'}}).populate({path:'conversations', populate:{path : 'whatsapp'}}).populate({path:'conversations', populate:{path : 'telegram'}}).populate({path:'conversations', populate:{path : 'viber'}}).populate({path:'conversations', populate:{path : 'comments'}}).populate({path:'conversations', populate:{path : 'instagram'}}).populate({path:'conversations', populate:{path : 'sms'}})
        const total = await TicketListModel.countDocuments(finalQuery)
        const totalOpen = await TicketListModel.countDocuments({ ...finalQuery, "status.name" : "open" })
        const totalClose = await TicketListModel.countDocuments({ ...finalQuery, "status.name" : "closed"})
        const totalInProgress = await TicketListModel.countDocuments({ ...finalQuery, "status.name" : "in-progress"})

        const data = {
            totalCount: total,
            totalOpen : totalOpen,
            totalClose : totalClose,
            totalInProgress : totalInProgress,
            data: userStatusDetails
        }

        this.data = data
        this.status = true
        this.message = 'Status Fetched'
        return res.json(this.Response())
    }

    updateNextTicketIdInConfig = async (query : any , body : any) =>{
        await AppConfig.findOneAndUpdate(query , body)
    }

    checkIfConfigIsPresentForParticularAccount = async (data : TicketTypes) =>{
        const query = {'auth_id': data.AccountSid , app_name : 'ticket'}
        const findDetails : any = await AppConfig.findOne(query)
        //console.log("Find Config of tickets : ", findDetails)
        if(!findDetails){
            return {status : false , data :{}}
        }

        let nextTicket = `${findDetails.tkt_prefix ? findDetails.tkt_prefix : ''}-${findDetails.next_tkt_id ? parseInt(findDetails.next_tkt_id) + 1 : data.ticket_id}`

        const updates = {
            $set : {
                next_tkt_id : parseInt(findDetails.next_tkt_id) + 1
            }
        }
        await this.updateNextTicketIdInConfig(query , updates)
        return {status : true , data : findDetails , ticket_id : nextTicket}
    }

    verifiedNumberFromGupshup = async ( data : payloadForOptent ) =>{
       
        const tempBody = {
            userid : data.user_id,
            password : data.password,
            phone_number : data.phone_number,
            v : '1.1',
            format:  'json',
            msg_type : 'TEXT',
            method : 'OPT_IN',
            auth_scheme : 'plain',
            channel : 'WHATSAPP'
        }

        const gupshup = new Gupshup()
        const response : any = await gupshup.optetUser(tempBody)
        console.log("response : ", response)
        const json = JSON.parse(response)
        return json
        
    }

    sendDataToWhatspp = async (userDetails : authenticationForGupshupAndCustomerDetails)=>{
        
        const tempBody = {
            userid : userDetails.user_id,
            password : userDetails.password,
            send_to : userDetails.phone_number,
            v : '1.1',
            format:  'json',
            msg_type : 'TEXT',
            method : 'SENDMESSAGE',
            msg: userDetails.message,
            isTemplate : 'true',
            buttonUrlParam : userDetails.buttonUrlParam
        }

        const gupshup = new Gupshup()
        const response : any = await gupshup.sendMessage(tempBody)
        console.log("Response : ", response)
        const json = JSON.parse(response)
        return json
    }

    sendDataToWhatsppWithoutTemplate = async (userDetails : authenticationForGupshupAndCustomerDetails)=>{
        
        const tempBody = {
            userid : userDetails.user_id,
            password : userDetails.password,
            send_to : userDetails.phone_number,
            v : '1.1',
            format:  'json',
            msg_type : 'TEXT',
            method : 'SENDMESSAGE',
            msg: userDetails.message,
            isTemplate : 'false',
            buttonUrlParam : userDetails.buttonUrlParam
        }

        const gupshup = new Gupshup()
        const response : any = await gupshup.sendMessage(tempBody)
        console.log("Response : ", response)
        const json = JSON.parse(response)
        return json
    }

    verifyThenSend = async (tempObj : authenticationForGupshupAndCustomerDetails )=>{
        const responseFromOptet = await this.verifiedNumberFromGupshup(tempObj)
        console.log("Response from optet : ",responseFromOptet)
        if(responseFromOptet.response){
            if(responseFromOptet.response.status === 'success'){
                const responseOfMessage = await this.sendDataToWhatspp(tempObj)
                console.log("Response Of Message : ",responseOfMessage)
                return responseOfMessage
            }
        }
    }

    verifyThenSendWithoutTemplate = async (tempObj : authenticationForGupshupAndCustomerDetails )=>{
        const responseFromOptet = await this.verifiedNumberFromGupshup(tempObj)
        console.log("Response from optet : ",responseFromOptet)
        if(responseFromOptet.response){
            if(responseFromOptet.response.status === 'success'){
                const responseOfMessage = await this.sendDataToWhatsppWithoutTemplate(tempObj)
                console.log("Response Of Message : ",responseOfMessage)
                return responseOfMessage
            }
        }
    }

    getValueFromCustomFields = (key : string , customVariables : any[]) =>{
        const value = customVariables.find((field)=>{
            if(field.name === key && field.type === 'select'){
                return field
            }
        })
        return value
    }

    createFeedBack = async ( body : SendFeedback ) =>{
        try{
            const response : any = await sendFeedbackFormData(body)
            const jsonResponse = JSON.parse(response)
            if(jsonResponse.success){
                return { status : true , data : response }
            }
            return { status : false , data : jsonResponse}
        }catch(err : any){
            console.log(err)
            return { status : false , data : err}
        }
    }

    public async postTickets (req : IRequest , res : IResponse) : Promise<any>{
        const body : TicketTypes = req.body
        console.log("Body : ", body)
        let isFeedBackSent = false
        const newTicketId = await this.checkIfConfigIsPresentForParticularAccount(body)        
        if(newTicketId.status){
            body.ticket_id = newTicketId.ticket_id
        }
        if(!body.ticket_id) {
            this.data = []
            this.status = false
            this.message = 'No ticket_id is provided in setting or body'
            return res.json(this.Response())
        }

        const allowedAccountToSendMessageOnCreate = '377K4JY5DGAA5XQ5GXIX'
        let sendMessage = true
        if(allowedAccountToSendMessageOnCreate === '377K4JY5DGAA5XQ5GXIX' && sendMessage === true){
            const gupshupId = config.GUPSHUP_ID
            const gupshupPassword = config.GUPSHUP_PASSWORD
            const contactName = body.contact_name ? body.contact_name : "Admin"
            const contactNumber = body.contact_number ? body.contact_number : "918420014466"
            let adminNumber = body.admin_number ? body.admin_number : "918420014466"
            let cityHeadNumber
            const ticketId = body.ticket_id
            const payloadForCustomer = {
                user_id : gupshupId,
                password : gupshupPassword,
                phone_number : contactNumber,
                message : `Dear+${contactName}+%2C%0A%0AThank+you+for+contacting+Wow+Momo.%0AYour+ticket+has+been+received+and+we+are+working+to+resolve+it+as+quickly+as+possible.%0A%0AYour+Ticket+ID+is+-+${ticketId}%0A%0AA+member+of+our+team+will+be+in+touch+with+you+shortly+to+discuss+your+issue+in+more+detail+and+provide+any+assistance+that+you+may+need.%0A%0ARegards%2C%0AWOW+Momo`
                // message : `Dear+${contactName}%2C%0A%0AThank+you+for+contacting+Wow+Momo.%0AWe+have+received+your+ticket+and+are+working+to+resolve+your+issue+as+quickly+as+possible.%0A%0AYour+Ticket+ID+is+-+${ticketId}%0A%0AA+member+of+our+team+will+be+in+touch+with+you+shortly+to+discuss+your+issue+in+more+detail+and+provide+any+assistance+that+you+may+need.%0A%0ARegards%2C%0AWOW+Momo`
            }   

            const issueValue = this.getValueFromCustomFields( 'Category' ,body.CustomVariables)
            const selectedStore = this.getValueFromCustomFields('Store' , body.CustomVariables)
            const storeAdminNumber : any  = await Store.findOne({storeName : selectedStore.selected_value })
            console.log("Issue Value : ", issueValue)
            console.log("Selected Store : " , storeAdminNumber , selectedStore )
            const branch = selectedStore.selected_value
            adminNumber = storeAdminNumber.storeManager
            cityHeadNumber = storeAdminNumber.cityHead
            const queryType = issueValue.selected_value
            const payloadForAdmin = {
                user_id : gupshupId,
                password : gupshupPassword,
                phone_number : adminNumber,
                message : `Hi%2C%0A%0AWe+have+received+a+new+complaint+for+store+-+${branch}%0A%0ATicket+ID+-+${body.ticket_id}%0ASubject+-+${body.ticket_details}%0AQuery+Type+-+${queryType}%0ACustomer+Name+-+${contactName}%0ACustomer+Number+-+${contactNumber}%0A%0APlease+call+back+customer+and+take+necessary+action+ASAP.`
            }

            const payloadForCityHead = {
                user_id : gupshupId,
                password : gupshupPassword,
                phone_number : cityHeadNumber,
                message : `Hi%2C%0A%0AWe+have+received+a+new+complaint+for+store+-+${branch}%0A%0ATicket+ID+-+${body.ticket_id}%0ASubject+-+${body.ticket_details}%0AQuery+Type+-+${queryType}%0ACustomer+Name+-+${contactName}%0ACustomer+Number+-+${contactNumber}%0A%0APlease+call+back+customer+and+take+necessary+action+ASAP.`
            }
            //@ts-ignore
            await this.verifyThenSendWithoutTemplate(payloadForCustomer)
            //@ts-ignore
            await this.verifyThenSend(payloadForAdmin)
            //@ts-ignore
            await this.verifyThenSend(payloadForCityHead)

            const inputDate = new Date().toUTCString();
            const parsedDate = moment.utc(inputDate, "ddd, DD MMM YYYY HH:mm:ss [GMT]");

            const formattedDate = parsedDate.format("YYYY-MM-DDTHH:mm:ssZ");

            //Create a payload to send feedback
            const reqPayloadForFeedBack : SendFeedback = {
                "business_uuid": storeAdminNumber?.businessUuid,
                "branch": storeAdminNumber?.branchCodeForFeedBack,
                "reviewer_name": contactName,
                "contact_number": `+${contactNumber}`,
                "email": "",
                "review_time": formattedDate,
                "rating": 3,
                "review_text": "",
                "review_tags": "",
                "remarks": body?.ticket_details
            }

            //Send FeedBack.
            const feedBack : {status : boolean , data : any } = await this.createFeedBack(reqPayloadForFeedBack)
            if(feedBack.status){
                isFeedBackSent = true
            }
        }


        const list = new TicketListModel(body)
        const response : any = await list.save()
        console.log("Reponse : ", response)
        this.code = 200;
        this.status = true
   
        this.data = {...body, _id : response._id , is_FeedBack_Sent : isFeedBackSent}

        return res.json(this.Response())
    }

    public async patchTickets (req : IRequest , res : IResponse) : Promise<any>{
        const id = req.params.id
        const body = req.body
        
        const query = {_id : id}
        const updates = {...body , updatedAt :  Date.now()}
        
        const updatedData = await TicketListModel.findOneAndUpdate(query , updates)

        this.data = updatedData
        this.status = true
        this.message = 'Ticket Edited'

        return res.json(this.Response())
    }
}