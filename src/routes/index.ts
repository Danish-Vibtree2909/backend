import { Router } from 'express'
//Security Controller lanuch
import SecurityController from '../controllers/SecurityController'
//WorkFlow Controller Launch
import WorkFlowController from '../controllers/WorkFlowController';
//VoiceController 
import VoiceController from '../controllers/VoiceControllers'
//CloudPhoneController - Launch
import CloudPhoneController from '../controllers/CloudPhoneController';
//Contact 
import Contact from '../controllers/ContactController'
//Custom Fields
import CustomFieldController from '../controllers/CustomFieldController';
//Power Dialer
import PowerDialerController from '../controllers/PowerDialerController';
//IvrStudios
import IvrStudios from '../controllers/IvrStudiosControllers';
//Group Controller
import GroupController from '../controllers/GroupController';
//TicketList
import TicketListControllers from '../controllers/TicketListControllers';
//CloudPhoneWebhookController - Launch
import CloudPhoneWebhookController from '../controllers/CloudPhoneWebhookController';
//WebHook not modified
import WebSocket from '../controllers/WebSocketController';
//Blocklist
import BlocklistController from '../controllers/BlocklistController'
//User Status
import UserStatusController from '../controllers/UserStatusController'
//User 
import UserController from '../controllers/UserController';
//Roles 
import UserRoleController from '../controllers/UserRoleController';
//Google OAuth function 

import {googleOauthHandler , googleOauthRegisterHandler} from '../controllers/GoogleOAuthController'

//Inbox
import InboxController from '../controllers/InboxController'


//Dashboard
import DashboardController from '../controllers/DashboardController';

//Plans 
import PlanController from '../controllers/PlanController';

//Subscription
import SubscriptionController from '../controllers/SubscriptionController';

//Coupon Controller
import CouponController from '../controllers/CouponController';

//Lead Controller
import LeadController from '../controllers/LeadController';

//VoiceMail
import VoiceMail from '../controllers/VoicemailController';

//Available Cloud Number
import AvailableCloudNumber from '../controllers/AvailableNumberController';

//SMS Controller 
import SMSController from '../controllers/SmsController'

//Application Config
import AppConfigController from '../controllers/AppConfigControllers';

//Allies 
import AlliesController from '../controllers/AlliesController';

//WOW-MOMO
import WowMomoController from '../controllers/WowMomoController';

import catchAysncError from '../middleware/catchAysncError'
import BaseException from '../exceptions/BaseException'
import {jwtAuth , checkFormatOfId , validateSubscription} from '../middleware/index'
const upload = require("../middleware/multer");

const router: Router = Router()
const securityController = new SecurityController()
const workFlowController = new WorkFlowController()
const voiceController = new VoiceController()
const cloudPhoneController = new CloudPhoneController()
const contact = new Contact()
const customFieldController = new CustomFieldController()
const powerDialerController = new PowerDialerController()
const ivrStudios = new IvrStudios()
const groupController = new GroupController()
const ticketListControllers = new TicketListControllers()
const cloudPhoneWebhookController = new CloudPhoneWebhookController()
const webSocket = new WebSocket()
const blocklistController = new BlocklistController()
const userStatusController = new UserStatusController()
const userController = new UserController()
const userRoleController = new UserRoleController()
const inboxController = new InboxController()
const dashboardController = new DashboardController()
const planController = new PlanController()
const subscriptionController = new SubscriptionController()
const couponController = new CouponController()
const leadController = new LeadController()
const voiceMail = new VoiceMail()
const availableCloudNumber = new AvailableCloudNumber()
const smsController = new SMSController()
const appConfigController = new AppConfigController()
const alliesController = new AlliesController()
const wowMomoController = new WowMomoController()

//WowMomoController
router.post('/sendfeedback' , wowMomoController.SendFeedBackToWowoMomo)

//Allies Controller
router.get('/allies', jwtAuth , catchAysncError(alliesController.getAllies))
router.post('/allies', jwtAuth , catchAysncError(alliesController.createAllies))
router.patch('/allies/:id', jwtAuth , catchAysncError(alliesController.updateAllies))
router.delete('/allies/:id', jwtAuth , catchAysncError(alliesController.deleteAllies))
router.get('/allies/:id', jwtAuth , catchAysncError(alliesController.getAlliesById))

//App Configuration
router.get('/me/app-config', jwtAuth , catchAysncError(appConfigController.getMyConfigAppConfig))
router.get('/app-config', jwtAuth , catchAysncError(appConfigController.getAppConfig))
router.post('/app-config',  jwtAuth, catchAysncError(appConfigController.createAppConfig))
router.patch('/app-config/:id', jwtAuth, catchAysncError(appConfigController.updateAppConfig))
router.delete('/app-config/:id', jwtAuth, catchAysncError(appConfigController.deleteAppConfig))
router.get('/app-config/:id', jwtAuth, catchAysncError(appConfigController.getAppConfigById))

//Sms
router.get('/filter/sms/conversations' , jwtAuth , catchAysncError(smsController.filterConversation)) 
router.get('/sms/messages/:conversationId' , jwtAuth , catchAysncError(smsController.getAllMessageOfConversation))
router.get('/sms/conversations', jwtAuth , catchAysncError(smsController.getAllConversations))
router.post('/sms/thinq/send', jwtAuth , validateSubscription , catchAysncError(smsController.sendMessageFromThinq))

//Cloud number
router.get('/international/numbers/voice' , jwtAuth , catchAysncError(availableCloudNumber.fetchAllInternationalNumbers))
router.get('/domestic/numbers/voice', jwtAuth , catchAysncError(availableCloudNumber.fetchAllNumbersFromInventory))
router.post('/buy/number/voice', jwtAuth , catchAysncError(availableCloudNumber.purchaseNumberBasedOnSubscription) )
router.post('/international/number/purchase' , jwtAuth , catchAysncError(availableCloudNumber.orderNumberFromThinqAndConfirm))

//Coupon
router.post('/coupon/isvalid',  catchAysncError(couponController.checkIfCouponValid))
router.post('/coupon/verify' , catchAysncError(couponController.verifyAndPlan))

//Lead Controller 
router.post('/lead', catchAysncError(leadController.createLead))
router.delete('/lead' ,catchAysncError(leadController.deleteLead))

//Dashboard Controller
router.get('/dashboard/call_details', jwtAuth , catchAysncError(dashboardController.dashBoardCallStats))
router.get('/dashboard/hourly_stats', jwtAuth  ,catchAysncError(dashboardController.hourlyCallStats))


//Subscription 
router.post('/subscribe', jwtAuth  ,catchAysncError(subscriptionController.activateSubscription))
router.get('/subscription/me' , jwtAuth  , catchAysncError(subscriptionController.getById))

//PlanController
router.get('/plans' , jwtAuth ,catchAysncError(planController.getAllPlans))
router.post('/plan', jwtAuth , catchAysncError(planController.creatPlan))
router.get('/plan/:id', jwtAuth , checkFormatOfId , catchAysncError(planController.getPlanById))

//InboxController
router.get('/inbox/view',jwtAuth  ,catchAysncError(inboxController.getAllInbox))
router.post('/inbox/view', jwtAuth ,catchAysncError(inboxController.postInbox))
router.patch('/inbox/view/:id',jwtAuth, checkFormatOfId, catchAysncError(inboxController.udateInbox))
router.delete('/inbox/view/:id',jwtAuth, checkFormatOfId ,catchAysncError(inboxController.deleteInbox))
router.get('/inbox/view/:id' , jwtAuth , checkFormatOfId, catchAysncError(inboxController.getInboxById))
router.post('/analytics/voice/user/stats' , jwtAuth  , catchAysncError(inboxController.calculateDetailsAccordingToInbox))
router.get('/verify/inbox/view', jwtAuth , catchAysncError(inboxController.checkNumberCapabilityBeforeCreatinginbox))

//Google OAuth 
router.get('/session/oauth/google', catchAysncError(googleOauthHandler))
router.post('/google/login', catchAysncError(googleOauthHandler))
router.post('/google/register', catchAysncError(googleOauthRegisterHandler))

//user-permission-role apis
router.get('/roles', jwtAuth, catchAysncError(userRoleController.getUserRoles))
router.get('/roles/:id', jwtAuth, checkFormatOfId ,catchAysncError(userRoleController.getUserRolesById))
router.post('/roles', jwtAuth ,catchAysncError(userRoleController.createUserRole))
router.put('/roles/:id', jwtAuth, checkFormatOfId ,catchAysncError(userRoleController.updateUserRole))
router.delete('/roles/:id', jwtAuth, checkFormatOfId ,catchAysncError(userRoleController.deleteUserRoleById))


// auth register UploadLogo
router.get('/download/user_logo', catchAysncError(userController.downloadUserLogo))
router.post('/user/upload', upload.single("file") , catchAysncError(userController.uploadUserLogo))
router.get('/download/company_logo', catchAysncError(userController.downloadCompanylogo))
router.post('/company/upload', upload.single("file") , catchAysncError(userController.uploadCompanyLogo))
router.post('/invite/user',jwtAuth, catchAysncError(userController.inviteUser))
router.post('/invite/resend',jwtAuth, catchAysncError(userController.reSendEmail))
router.get('/UserConfirmation/:token', catchAysncError(userController.verifyAndCreateUser))
router.post('/setpassword', jwtAuth , catchAysncError(userController.changePasswordOnly))
router.delete('/user/:id', jwtAuth , catchAysncError(userController.deleteUser))

//User Status 
router.get('/user/status', jwtAuth , catchAysncError(userStatusController.getAllUserStatus))
router.post('/user/status', jwtAuth , catchAysncError(userStatusController.postUserStatus))
router.patch('/user/status/:id', jwtAuth , catchAysncError(userStatusController.udateUserStatus))
router.delete('/user/status/:id', jwtAuth , catchAysncError(userStatusController.deleteUserStatus))
router.get('/user/status/:id', jwtAuth , catchAysncError(userStatusController.getUserById))
router.get('/user/me/status', jwtAuth , catchAysncError(userStatusController.getStatuOfOwn))

//Blocklist
router.get('/blocklist', jwtAuth , catchAysncError(blocklistController.getBlockList))
router.post('/blocklist' , jwtAuth , catchAysncError(blocklistController.createBlockList))
router.patch('/blocklist/:id', jwtAuth,  catchAysncError(blocklistController.updateBlockList))
router.delete('/blocklist/:id', jwtAuth , catchAysncError(blocklistController.deleteBlocklist))
router.get('/blocklist/:id', jwtAuth , catchAysncError(blocklistController.getBlockListById))

//Webhook
router.post('/v2/webhooks/vibconnect/cp/phone', catchAysncError(cloudPhoneWebhookController.cloudPhoneConferenceWebhook))
router.post('/v2/webhooks/vibconnect/cp/webrtc', catchAysncError(cloudPhoneWebhookController.cloudPhoneConferenceAndCallWebhookForWebRtc))
router.post('/webhook/vibconnect/ivr_studios', catchAysncError(webSocket.ivrStudiosStatusCallback))
router.post('/webhook/vibconnect/message', catchAysncError(webSocket.vibconnectMessage))
router.get('/webhook/thinq/message' , catchAysncError(webSocket.thiqMessage))
router.post('/webhook/thinq/message' , catchAysncError(webSocket.thiqMessage))
router.post('/webhook/vibconnect/conference', catchAysncError(webSocket.RecieveConferenceCallBacksAndSave))
router.post('/webhook/vibconnect/ivr_studios/api_call' , catchAysncError(webSocket.ivrStudiosApiCallStatusCallback))
router.post('/webhook/vibconnect/ivr_studios/api_call/parallel' , catchAysncError(webSocket.ivrStudiosApiCallStatusCallbackForParallelCalling))
router.post('/webhook/vibconnect/voicemail', catchAysncError(webSocket.voicemailCallBack))
router.post('/vibconnect/webhook/recordings', catchAysncError(webSocket.RecieveRecordingCallbacksAndSave))
router.post('/webhook/instagram', catchAysncError(webSocket.postInstagramMeta))
router.get('/webhook/instagram', catchAysncError(webSocket.getInstagramMeta))
router.post('/v2/webhook/vibconnect/cp/phone/transfer', catchAysncError(cloudPhoneWebhookController.cloudPhoneTransferWebhook))


//TicketList
router.post('/ticket-list' , catchAysncError(ticketListControllers.postTickets))
router.patch('/ticket-list/:id', jwtAuth , catchAysncError(ticketListControllers.patchTickets))
router.get('/ticket-list', jwtAuth , catchAysncError(ticketListControllers.getAllTickets))
router.get('/ticket-list/:id' ,jwtAuth , catchAysncError(ticketListControllers.getTicketsById) )
router.post('/ticket-list/addConversation', jwtAuth , catchAysncError(ticketListControllers.addVoiceToConversation))


// group(Contact) apis
router.get('/groups', jwtAuth, catchAysncError(groupController.getGroup))
router.post('/groups',jwtAuth, catchAysncError(groupController.createGroup))
router.put('/groups/:id', jwtAuth, catchAysncError(groupController.updateGroup))
router.delete('/groups/:id', jwtAuth, catchAysncError(groupController.deleteGroup))
router.get('/groups/:id', jwtAuth , catchAysncError(groupController.getGroupById))


//IVR Studios
router.get('/xmlGenerator', ivrStudios.xmlGenerator)
router.get('/Recording', catchAysncError(ivrStudios.downloadRecording))
router.get('/realtime', jwtAuth , catchAysncError(ivrStudios.getRealTimeData))
router.delete('/deleteAudio', jwtAuth, catchAysncError(ivrStudios.deleteAudioFromS3))
router.get('/cancel', ivrStudios.numberNotInService)
router.get('/v2/ivrstudios', ivrStudios.createIvrFlowAccordingToUIFlowVersionTwo)
router.get('/v2/ivrstudios/convert/:id/:target/:source', ivrStudios.getTargetNodeAndExecuteVersionTwo)
router.post('/v2/ivrstudios/convert/:id/:target/:source', ivrStudios.getTargetNodeAndExecuteVersionTwo)
router.get('/getConferenceRoom/:customer_number/:url?', ivrStudios.getConferenceRoom)
router.get('/getVibconnectDataAndModefiy/:action' , ivrStudios.getVibconnectDataAndModefiy)
router.post('/getVibconnectDataAndModefiy/:action' , ivrStudios.getVibconnectDataAndModefiy)
router.get('/checkIfCustomerInLine/:conferenceRoom/:url', ivrStudios.checkIfCustomerInLine)

 //PowerDialer Launch
 router.get('/v2/power_dialer', jwtAuth , catchAysncError(powerDialerController.getPowerDialerVersionTwo))
 router.get('/v2/power_dialer/stats', jwtAuth , catchAysncError(powerDialerController.getPowerDialerStatusVersionTwo))
 router.post('/v2/power_dialer', jwtAuth , catchAysncError(powerDialerController.createPowerDialerVersionTwo))
 router.patch('/v2/power_dialer/:id', jwtAuth , catchAysncError(powerDialerController.updatePowerDialerVersionTwo))
 router.delete('/v2/power_dialer/:id', jwtAuth , catchAysncError(powerDialerController.deletePowerDialerVersionTwo))
 router.post('/v2/power_dialer/delete', jwtAuth , catchAysncError(powerDialerController.deleteManyPowerDialerVersionTwo))
 router.post('/v2/power_dialer/insert', jwtAuth , catchAysncError(powerDialerController.insertManyPowerDialerVersionTwo))
 router.get('/v2/power_dialer/:id', jwtAuth , catchAysncError(powerDialerController.getByIdPowerDialerVersionTwo))
 
//CustomField apis
router.get('/customfields', jwtAuth , catchAysncError(customFieldController.getAllCustomField))
router.post('/customfields' , jwtAuth , catchAysncError(customFieldController.createCustomField))
router.get('/exist/customfields', jwtAuth , catchAysncError(customFieldController.checkIfKeyIsAlreadyExist))
router.put('/customfields/:id', jwtAuth , checkFormatOfId , catchAysncError(customFieldController.updateCustomField))
router.get('/customfields/:id', jwtAuth , checkFormatOfId ,catchAysncError(customFieldController.getCustomFieldById))
router.delete('/customfields/:id', jwtAuth , checkFormatOfId ,catchAysncError(customFieldController.deleteCustomField))

//contacts apis
router.get('/contacts', jwtAuth , catchAysncError(cloudPhoneController.singleContactDetails))
router.get('/contacts/:id', jwtAuth , catchAysncError(contact.getContactById))
router.post('/contact', jwtAuth , upload.single('file') , catchAysncError(contact.createContactFunction))
router.patch('/contact/:id', jwtAuth , catchAysncError(contact.updateOnlyBodyOfContact))
router.patch('/image/contact/:id', jwtAuth , upload.single('file') , catchAysncError(contact.updateImageOfContact))
router.delete('/contact/:id', jwtAuth , catchAysncError(contact.deleteContact))
router.post('/deletemany/contacts', jwtAuth , catchAysncError(contact.deleteManyContacts))
router.post('/insertmany/contacts', jwtAuth, catchAysncError(contact.insertManyContacts))
router.get('/download/contact', catchAysncError(contact.downloadContactImage))

//SecurityController Launch 
router.post('/v2/login', catchAysncError(securityController.LoginVersionTwo))
router.post('/v2/logout', catchAysncError(securityController.LogoutVersionTwo))
router.post('/v2/email/sendotp', catchAysncError(securityController.sendOtpToMail))
router.post('/v2/verifyotp', catchAysncError(securityController.verifyOTP))
router.post('/password', catchAysncError(securityController.changePassword))
router.post('/v2/phone/sendotp', catchAysncError(securityController.sendOtpToPhoneNumber))
router.get('/exist', catchAysncError(securityController.checkIfValueExistInUserDB))
router.post('/register', catchAysncError(securityController.RegisterVersionTwo))
router.patch('/user', jwtAuth, catchAysncError(securityController.editUser))

//WorkFlowController Launch
router.post('/workflow', jwtAuth , catchAysncError(workFlowController.createWorkFlow))
router.delete('/workflow/:id', jwtAuth , checkFormatOfId , catchAysncError(workFlowController.deleteWorkFlowById))
router.put('/workflow/:id', jwtAuth , checkFormatOfId ,catchAysncError(workFlowController.updateWorkFlowById))
router.get('/workflow/:id' , jwtAuth , checkFormatOfId , catchAysncError(workFlowController.getWorkFlowById))
router.get('/workflow' , jwtAuth , catchAysncError(workFlowController.getWorkFlows))
router.post('/text-to-speech', workFlowController.ConvertTextToSpeech)
router.post('/audio_save',upload.single("audio"), workFlowController.uploadAudio)
router.post('/ssml-to-speech', workFlowController.ConvertSsmlToSpeech)

//Voice CDR
router.get('/voice', jwtAuth , catchAysncError(voiceController.getVoiceCdr) )
router.get('/voice/:id', jwtAuth , catchAysncError(voiceController.getVoiceCdrById))
router.put('/voice/:id', jwtAuth , catchAysncError(voiceController.updateVoiceCdrById))
router.get('/stats/voice', jwtAuth , catchAysncError(voiceController.calculateCallStatusStats))
router.post('/stats/voice', jwtAuth , catchAysncError(voiceController.calculateCallStatusStats))
router.post('/filter/voice' , jwtAuth , catchAysncError(voiceController.filterVoiceCdr))

//CloudPhoneController - Launch
router.get('/getConferenceRoomForCloudPhone/:customer_number/:url', cloudPhoneController.getConferenceRoomForCloudPhone)
router.get('/getConferenceRoomForCloudPhoneWebrtc/:customer_number/:url', cloudPhoneController.getConferenceRoomForCloudPhoneWebrtc)
router.put('/cp/edit/:id' , jwtAuth , catchAysncError(cloudPhoneController.editNotesOrTags))
router.post('/cp/call' , jwtAuth , validateSubscription, catchAysncError(cloudPhoneController.Call))
router.get('/cp/cloudnumbers', jwtAuth , catchAysncError(cloudPhoneController.getCloudNumbers))
router.get('/cp/contacts' , jwtAuth , catchAysncError(cloudPhoneController.singleContactDetails))
router.get('/cp/logs', jwtAuth , catchAysncError(cloudPhoneController.getCallLogs))
router.post('/cp/phonecall', jwtAuth , validateSubscription, catchAysncError(cloudPhoneController.phoneCall))
router.get('/user/me' , jwtAuth , catchAysncError(cloudPhoneController.getSingleUserInfo))
router.get('/v2/users', jwtAuth , catchAysncError(cloudPhoneController.getUsersDetails))
router.post('/cp/hangup' , jwtAuth , catchAysncError(cloudPhoneController.killCallConference))
router.get('/application/sipcalls', catchAysncError(cloudPhoneController.applicationForSip))
router.post('/cp/transfer' , jwtAuth , catchAysncError(cloudPhoneController.transferCall))
router.get('/getConferenceRoomForTranferCall/:customer_number/:url', cloudPhoneController.getConferenceRoomForTransfercall)
router.post('/cp/hangup/transfer'  , catchAysncError(cloudPhoneController.hangupTransferCallAndSaveCdr))
router.post('/cp/hold', jwtAuth , catchAysncError(cloudPhoneController.handleHoldOrUnhold))
router.post('/cp/killcall', jwtAuth , catchAysncError(cloudPhoneController.killParticularCall))

//VoiceMail
router.post('/voiceMail/create', jwtAuth , catchAysncError(voiceMail.createVoiceMailBox))
router.patch('/voiceMail/update/:id', jwtAuth , checkFormatOfId, catchAysncError(voiceMail.updateVoiceMailBox))
router.delete('/voiceMail/delete/:id', jwtAuth , checkFormatOfId ,catchAysncError(voiceMail.deleteVoiceMailBox))
router.get('/voiceMail/getAll', jwtAuth , catchAysncError(voiceMail.getAllVoiceMailBoxes))
router.get('/voiceMail/get/:id', jwtAuth , checkFormatOfId , catchAysncError(voiceMail.getVoiceMailBoxById))
router.get('/voiceMail/records', jwtAuth , catchAysncError(voiceMail.getVoiceMailRecordByName))

router.all('*', (req, res, next) => {
    const err = new BaseException(404, `Invalid URI path found : ${req.path}`, 'INVALID_URI');
    next(err);
    return res.status(404).json({"message":"Invalid URL!"})
})


export default router
