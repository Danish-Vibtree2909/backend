"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//Security Controller lanuch
const SecurityController_1 = __importDefault(require("../controllers/SecurityController"));
//WorkFlow Controller Launch
const WorkFlowController_1 = __importDefault(require("../controllers/WorkFlowController"));
//VoiceController 
const VoiceControllers_1 = __importDefault(require("../controllers/VoiceControllers"));
//CloudPhoneController - Launch
const CloudPhoneController_1 = __importDefault(require("../controllers/CloudPhoneController"));
//Contact 
const ContactController_1 = __importDefault(require("../controllers/ContactController"));
//Custom Fields
const CustomFieldController_1 = __importDefault(require("../controllers/CustomFieldController"));
//Power Dialer
const PowerDialerController_1 = __importDefault(require("../controllers/PowerDialerController"));
//IvrStudios
const IvrStudiosControllers_1 = __importDefault(require("../controllers/IvrStudiosControllers"));
//Group Controller
const GroupController_1 = __importDefault(require("../controllers/GroupController"));
//TicketList
const TicketListControllers_1 = __importDefault(require("../controllers/TicketListControllers"));
//CloudPhoneWebhookController - Launch
const CloudPhoneWebhookController_1 = __importDefault(require("../controllers/CloudPhoneWebhookController"));
//WebHook not modified
const WebSocketController_1 = __importDefault(require("../controllers/WebSocketController"));
//Blocklist
const BlocklistController_1 = __importDefault(require("../controllers/BlocklistController"));
//User Status
const UserStatusController_1 = __importDefault(require("../controllers/UserStatusController"));
//User 
const UserController_1 = __importDefault(require("../controllers/UserController"));
//Roles 
const UserRoleController_1 = __importDefault(require("../controllers/UserRoleController"));
//Google OAuth function 
const GoogleOAuthController_1 = require("../controllers/GoogleOAuthController");
//Inbox
const InboxController_1 = __importDefault(require("../controllers/InboxController"));
//Dashboard
const DashboardController_1 = __importDefault(require("../controllers/DashboardController"));
//Plans 
const PlanController_1 = __importDefault(require("../controllers/PlanController"));
//Subscription
const SubscriptionController_1 = __importDefault(require("../controllers/SubscriptionController"));
//Coupon Controller
const CouponController_1 = __importDefault(require("../controllers/CouponController"));
//Lead Controller
const LeadController_1 = __importDefault(require("../controllers/LeadController"));
//VoiceMail
const VoicemailController_1 = __importDefault(require("../controllers/VoicemailController"));
//Available Cloud Number
const AvailableNumberController_1 = __importDefault(require("../controllers/AvailableNumberController"));
//SMS Controller 
const SmsController_1 = __importDefault(require("../controllers/SmsController"));
//Application Config
const AppConfigControllers_1 = __importDefault(require("../controllers/AppConfigControllers"));
//Allies 
const AlliesController_1 = __importDefault(require("../controllers/AlliesController"));
//WOW-MOMO
const WowMomoController_1 = __importDefault(require("../controllers/WowMomoController"));
const catchAysncError_1 = __importDefault(require("../middleware/catchAysncError"));
const BaseException_1 = __importDefault(require("../exceptions/BaseException"));
const index_1 = require("../middleware/index");
const upload = require("../middleware/multer");
const router = (0, express_1.Router)();
const securityController = new SecurityController_1.default();
const workFlowController = new WorkFlowController_1.default();
const voiceController = new VoiceControllers_1.default();
const cloudPhoneController = new CloudPhoneController_1.default();
const contact = new ContactController_1.default();
const customFieldController = new CustomFieldController_1.default();
const powerDialerController = new PowerDialerController_1.default();
const ivrStudios = new IvrStudiosControllers_1.default();
const groupController = new GroupController_1.default();
const ticketListControllers = new TicketListControllers_1.default();
const cloudPhoneWebhookController = new CloudPhoneWebhookController_1.default();
const webSocket = new WebSocketController_1.default();
const blocklistController = new BlocklistController_1.default();
const userStatusController = new UserStatusController_1.default();
const userController = new UserController_1.default();
const userRoleController = new UserRoleController_1.default();
const inboxController = new InboxController_1.default();
const dashboardController = new DashboardController_1.default();
const planController = new PlanController_1.default();
const subscriptionController = new SubscriptionController_1.default();
const couponController = new CouponController_1.default();
const leadController = new LeadController_1.default();
const voiceMail = new VoicemailController_1.default();
const availableCloudNumber = new AvailableNumberController_1.default();
const smsController = new SmsController_1.default();
const appConfigController = new AppConfigControllers_1.default();
const alliesController = new AlliesController_1.default();
const wowMomoController = new WowMomoController_1.default();
//WowMomoController
router.post('/sendfeedback', wowMomoController.SendFeedBackToWowoMomo);
//Allies Controller
router.get('/allies', index_1.jwtAuth, (0, catchAysncError_1.default)(alliesController.getAllies));
router.post('/allies', index_1.jwtAuth, (0, catchAysncError_1.default)(alliesController.createAllies));
router.patch('/allies/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(alliesController.updateAllies));
router.delete('/allies/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(alliesController.deleteAllies));
router.get('/allies/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(alliesController.getAlliesById));
//App Configuration
router.get('/me/app-config', index_1.jwtAuth, (0, catchAysncError_1.default)(appConfigController.getMyConfigAppConfig));
router.get('/app-config', index_1.jwtAuth, (0, catchAysncError_1.default)(appConfigController.getAppConfig));
router.post('/app-config', index_1.jwtAuth, (0, catchAysncError_1.default)(appConfigController.createAppConfig));
router.patch('/app-config/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(appConfigController.updateAppConfig));
router.delete('/app-config/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(appConfigController.deleteAppConfig));
router.get('/app-config/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(appConfigController.getAppConfigById));
//Sms
router.get('/filter/sms/conversations', index_1.jwtAuth, (0, catchAysncError_1.default)(smsController.filterConversation));
router.get('/sms/messages/:conversationId', index_1.jwtAuth, (0, catchAysncError_1.default)(smsController.getAllMessageOfConversation));
router.get('/sms/conversations', index_1.jwtAuth, (0, catchAysncError_1.default)(smsController.getAllConversations));
router.post('/sms/thinq/send', index_1.jwtAuth, index_1.validateSubscription, (0, catchAysncError_1.default)(smsController.sendMessageFromThinq));
//Cloud number
router.get('/international/numbers/voice', index_1.jwtAuth, (0, catchAysncError_1.default)(availableCloudNumber.fetchAllInternationalNumbers));
router.get('/domestic/numbers/voice', index_1.jwtAuth, (0, catchAysncError_1.default)(availableCloudNumber.fetchAllNumbersFromInventory));
router.post('/buy/number/voice', index_1.jwtAuth, (0, catchAysncError_1.default)(availableCloudNumber.purchaseNumberBasedOnSubscription));
router.post('/international/number/purchase', index_1.jwtAuth, (0, catchAysncError_1.default)(availableCloudNumber.orderNumberFromThinqAndConfirm));
//Coupon
router.post('/coupon/isvalid', (0, catchAysncError_1.default)(couponController.checkIfCouponValid));
router.post('/coupon/verify', (0, catchAysncError_1.default)(couponController.verifyAndPlan));
//Lead Controller 
router.post('/lead', (0, catchAysncError_1.default)(leadController.createLead));
router.delete('/lead', (0, catchAysncError_1.default)(leadController.deleteLead));
//Dashboard Controller
router.get('/dashboard/call_details', index_1.jwtAuth, (0, catchAysncError_1.default)(dashboardController.dashBoardCallStats));
router.get('/dashboard/hourly_stats', index_1.jwtAuth, (0, catchAysncError_1.default)(dashboardController.hourlyCallStats));
//Subscription 
router.post('/subscribe', index_1.jwtAuth, (0, catchAysncError_1.default)(subscriptionController.activateSubscription));
router.get('/subscription/me', index_1.jwtAuth, (0, catchAysncError_1.default)(subscriptionController.getById));
//PlanController
router.get('/plans', index_1.jwtAuth, (0, catchAysncError_1.default)(planController.getAllPlans));
router.post('/plan', index_1.jwtAuth, (0, catchAysncError_1.default)(planController.creatPlan));
router.get('/plan/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(planController.getPlanById));
//InboxController
router.get('/inbox/view', index_1.jwtAuth, (0, catchAysncError_1.default)(inboxController.getAllInbox));
router.post('/inbox/view', index_1.jwtAuth, (0, catchAysncError_1.default)(inboxController.postInbox));
router.patch('/inbox/view/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(inboxController.udateInbox));
router.delete('/inbox/view/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(inboxController.deleteInbox));
router.get('/inbox/view/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(inboxController.getInboxById));
router.post('/analytics/voice/user/stats', index_1.jwtAuth, (0, catchAysncError_1.default)(inboxController.calculateDetailsAccordingToInbox));
router.get('/verify/inbox/view', index_1.jwtAuth, (0, catchAysncError_1.default)(inboxController.checkNumberCapabilityBeforeCreatinginbox));
//Google OAuth 
router.get('/session/oauth/google', (0, catchAysncError_1.default)(GoogleOAuthController_1.googleOauthHandler));
router.post('/google/login', (0, catchAysncError_1.default)(GoogleOAuthController_1.googleOauthHandler));
router.post('/google/register', (0, catchAysncError_1.default)(GoogleOAuthController_1.googleOauthRegisterHandler));
//user-permission-role apis
router.get('/roles', index_1.jwtAuth, (0, catchAysncError_1.default)(userRoleController.getUserRoles));
router.get('/roles/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(userRoleController.getUserRolesById));
router.post('/roles', index_1.jwtAuth, (0, catchAysncError_1.default)(userRoleController.createUserRole));
router.put('/roles/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(userRoleController.updateUserRole));
router.delete('/roles/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(userRoleController.deleteUserRoleById));
// auth register UploadLogo
router.get('/download/user_logo', (0, catchAysncError_1.default)(userController.downloadUserLogo));
router.post('/user/upload', upload.single("file"), (0, catchAysncError_1.default)(userController.uploadUserLogo));
router.get('/download/company_logo', (0, catchAysncError_1.default)(userController.downloadCompanylogo));
router.post('/company/upload', upload.single("file"), (0, catchAysncError_1.default)(userController.uploadCompanyLogo));
router.post('/invite/user', index_1.jwtAuth, (0, catchAysncError_1.default)(userController.inviteUser));
router.post('/invite/resend', index_1.jwtAuth, (0, catchAysncError_1.default)(userController.reSendEmail));
router.get('/UserConfirmation/:token', (0, catchAysncError_1.default)(userController.verifyAndCreateUser));
router.post('/setpassword', index_1.jwtAuth, (0, catchAysncError_1.default)(userController.changePasswordOnly));
router.delete('/user/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(userController.deleteUser));
//User Status 
router.get('/user/status', index_1.jwtAuth, (0, catchAysncError_1.default)(userStatusController.getAllUserStatus));
router.post('/user/status', index_1.jwtAuth, (0, catchAysncError_1.default)(userStatusController.postUserStatus));
router.patch('/user/status/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(userStatusController.udateUserStatus));
router.delete('/user/status/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(userStatusController.deleteUserStatus));
router.get('/user/status/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(userStatusController.getUserById));
router.get('/user/me/status', index_1.jwtAuth, (0, catchAysncError_1.default)(userStatusController.getStatuOfOwn));
//Blocklist
router.get('/blocklist', index_1.jwtAuth, (0, catchAysncError_1.default)(blocklistController.getBlockList));
router.post('/blocklist', index_1.jwtAuth, (0, catchAysncError_1.default)(blocklistController.createBlockList));
router.patch('/blocklist/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(blocklistController.updateBlockList));
router.delete('/blocklist/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(blocklistController.deleteBlocklist));
router.get('/blocklist/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(blocklistController.getBlockListById));
//Webhook
router.post('/v2/webhooks/vibconnect/cp/phone', (0, catchAysncError_1.default)(cloudPhoneWebhookController.cloudPhoneConferenceWebhook));
router.post('/v2/webhooks/vibconnect/cp/webrtc', (0, catchAysncError_1.default)(cloudPhoneWebhookController.cloudPhoneConferenceAndCallWebhookForWebRtc));
router.post('/webhook/vibconnect/ivr_studios', (0, catchAysncError_1.default)(webSocket.ivrStudiosStatusCallback));
router.post('/webhook/vibconnect/message', (0, catchAysncError_1.default)(webSocket.vibconnectMessage));
router.get('/webhook/thinq/message', (0, catchAysncError_1.default)(webSocket.thiqMessage));
router.post('/webhook/thinq/message', (0, catchAysncError_1.default)(webSocket.thiqMessage));
router.post('/webhook/vibconnect/conference', (0, catchAysncError_1.default)(webSocket.RecieveConferenceCallBacksAndSave));
router.post('/webhook/vibconnect/ivr_studios/api_call', (0, catchAysncError_1.default)(webSocket.ivrStudiosApiCallStatusCallback));
router.post('/webhook/vibconnect/ivr_studios/api_call/parallel', (0, catchAysncError_1.default)(webSocket.ivrStudiosApiCallStatusCallbackForParallelCalling));
router.post('/webhook/vibconnect/voicemail', (0, catchAysncError_1.default)(webSocket.voicemailCallBack));
router.post('/vibconnect/webhook/recordings', (0, catchAysncError_1.default)(webSocket.RecieveRecordingCallbacksAndSave));
router.post('/webhook/instagram', (0, catchAysncError_1.default)(webSocket.postInstagramMeta));
router.get('/webhook/instagram', (0, catchAysncError_1.default)(webSocket.getInstagramMeta));
router.post('/v2/webhook/vibconnect/cp/phone/transfer', (0, catchAysncError_1.default)(cloudPhoneWebhookController.cloudPhoneTransferWebhook));
//TicketList
router.post('/ticket-list', (0, catchAysncError_1.default)(ticketListControllers.postTickets));
router.patch('/ticket-list/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(ticketListControllers.patchTickets));
router.get('/ticket-list', index_1.jwtAuth, (0, catchAysncError_1.default)(ticketListControllers.getAllTickets));
router.get('/ticket-list/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(ticketListControllers.getTicketsById));
router.post('/ticket-list/addConversation', index_1.jwtAuth, (0, catchAysncError_1.default)(ticketListControllers.addVoiceToConversation));
// group(Contact) apis
router.get('/groups', index_1.jwtAuth, (0, catchAysncError_1.default)(groupController.getGroup));
router.post('/groups', index_1.jwtAuth, (0, catchAysncError_1.default)(groupController.createGroup));
router.put('/groups/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(groupController.updateGroup));
router.delete('/groups/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(groupController.deleteGroup));
router.get('/groups/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(groupController.getGroupById));
//IVR Studios
router.get('/xmlGenerator', ivrStudios.xmlGenerator);
router.get('/Recording', (0, catchAysncError_1.default)(ivrStudios.downloadRecording));
router.get('/realtime', index_1.jwtAuth, (0, catchAysncError_1.default)(ivrStudios.getRealTimeData));
router.delete('/deleteAudio', index_1.jwtAuth, (0, catchAysncError_1.default)(ivrStudios.deleteAudioFromS3));
router.get('/cancel', ivrStudios.numberNotInService);
router.get('/v2/ivrstudios', ivrStudios.createIvrFlowAccordingToUIFlowVersionTwo);
router.get('/v2/ivrstudios/convert/:id/:target/:source', ivrStudios.getTargetNodeAndExecuteVersionTwo);
router.post('/v2/ivrstudios/convert/:id/:target/:source', ivrStudios.getTargetNodeAndExecuteVersionTwo);
router.get('/getConferenceRoom/:customer_number/:url?', ivrStudios.getConferenceRoom);
router.get('/getVibconnectDataAndModefiy/:action', ivrStudios.getVibconnectDataAndModefiy);
router.post('/getVibconnectDataAndModefiy/:action', ivrStudios.getVibconnectDataAndModefiy);
router.get('/checkIfCustomerInLine/:conferenceRoom/:url', ivrStudios.checkIfCustomerInLine);
//PowerDialer Launch
router.get('/v2/power_dialer', index_1.jwtAuth, (0, catchAysncError_1.default)(powerDialerController.getPowerDialerVersionTwo));
router.get('/v2/power_dialer/stats', index_1.jwtAuth, (0, catchAysncError_1.default)(powerDialerController.getPowerDialerStatusVersionTwo));
router.post('/v2/power_dialer', index_1.jwtAuth, (0, catchAysncError_1.default)(powerDialerController.createPowerDialerVersionTwo));
router.patch('/v2/power_dialer/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(powerDialerController.updatePowerDialerVersionTwo));
router.delete('/v2/power_dialer/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(powerDialerController.deletePowerDialerVersionTwo));
router.post('/v2/power_dialer/delete', index_1.jwtAuth, (0, catchAysncError_1.default)(powerDialerController.deleteManyPowerDialerVersionTwo));
router.post('/v2/power_dialer/insert', index_1.jwtAuth, (0, catchAysncError_1.default)(powerDialerController.insertManyPowerDialerVersionTwo));
router.get('/v2/power_dialer/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(powerDialerController.getByIdPowerDialerVersionTwo));
//CustomField apis
router.get('/customfields', index_1.jwtAuth, (0, catchAysncError_1.default)(customFieldController.getAllCustomField));
router.post('/customfields', index_1.jwtAuth, (0, catchAysncError_1.default)(customFieldController.createCustomField));
router.get('/exist/customfields', index_1.jwtAuth, (0, catchAysncError_1.default)(customFieldController.checkIfKeyIsAlreadyExist));
router.put('/customfields/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(customFieldController.updateCustomField));
router.get('/customfields/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(customFieldController.getCustomFieldById));
router.delete('/customfields/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(customFieldController.deleteCustomField));
//contacts apis
router.get('/contacts', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.singleContactDetails));
router.get('/contacts/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(contact.getContactById));
router.post('/contact', index_1.jwtAuth, upload.single('file'), (0, catchAysncError_1.default)(contact.createContactFunction));
router.patch('/contact/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(contact.updateOnlyBodyOfContact));
router.patch('/image/contact/:id', index_1.jwtAuth, upload.single('file'), (0, catchAysncError_1.default)(contact.updateImageOfContact));
router.delete('/contact/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(contact.deleteContact));
router.post('/deletemany/contacts', index_1.jwtAuth, (0, catchAysncError_1.default)(contact.deleteManyContacts));
router.post('/insertmany/contacts', index_1.jwtAuth, (0, catchAysncError_1.default)(contact.insertManyContacts));
router.get('/download/contact', (0, catchAysncError_1.default)(contact.downloadContactImage));
//SecurityController Launch 
router.post('/v2/login', (0, catchAysncError_1.default)(securityController.LoginVersionTwo));
router.post('/v2/logout', (0, catchAysncError_1.default)(securityController.LogoutVersionTwo));
router.post('/v2/email/sendotp', (0, catchAysncError_1.default)(securityController.sendOtpToMail));
router.post('/v2/verifyotp', (0, catchAysncError_1.default)(securityController.verifyOTP));
router.post('/password', (0, catchAysncError_1.default)(securityController.changePassword));
router.post('/v2/phone/sendotp', (0, catchAysncError_1.default)(securityController.sendOtpToPhoneNumber));
router.get('/exist', (0, catchAysncError_1.default)(securityController.checkIfValueExistInUserDB));
router.post('/register', (0, catchAysncError_1.default)(securityController.RegisterVersionTwo));
router.patch('/user', index_1.jwtAuth, (0, catchAysncError_1.default)(securityController.editUser));
//WorkFlowController Launch
router.post('/workflow', index_1.jwtAuth, (0, catchAysncError_1.default)(workFlowController.createWorkFlow));
router.delete('/workflow/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(workFlowController.deleteWorkFlowById));
router.put('/workflow/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(workFlowController.updateWorkFlowById));
router.get('/workflow/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(workFlowController.getWorkFlowById));
router.get('/workflow', index_1.jwtAuth, (0, catchAysncError_1.default)(workFlowController.getWorkFlows));
router.post('/text-to-speech', workFlowController.ConvertTextToSpeech);
router.post('/audio_save', upload.single("audio"), workFlowController.uploadAudio);
router.post('/ssml-to-speech', workFlowController.ConvertSsmlToSpeech);
//Voice CDR
router.get('/voice', index_1.jwtAuth, (0, catchAysncError_1.default)(voiceController.getVoiceCdr));
router.get('/voice/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(voiceController.getVoiceCdrById));
router.put('/voice/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(voiceController.updateVoiceCdrById));
router.get('/stats/voice', index_1.jwtAuth, (0, catchAysncError_1.default)(voiceController.calculateCallStatusStats));
router.post('/stats/voice', index_1.jwtAuth, (0, catchAysncError_1.default)(voiceController.calculateCallStatusStats));
router.post('/filter/voice', index_1.jwtAuth, (0, catchAysncError_1.default)(voiceController.filterVoiceCdr));
//CloudPhoneController - Launch
router.get('/getConferenceRoomForCloudPhone/:customer_number/:url', cloudPhoneController.getConferenceRoomForCloudPhone);
router.get('/getConferenceRoomForCloudPhoneWebrtc/:customer_number/:url', cloudPhoneController.getConferenceRoomForCloudPhoneWebrtc);
router.put('/cp/edit/:id', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.editNotesOrTags));
router.post('/cp/call', index_1.jwtAuth, index_1.validateSubscription, (0, catchAysncError_1.default)(cloudPhoneController.Call));
router.get('/cp/cloudnumbers', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.getCloudNumbers));
router.get('/cp/contacts', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.singleContactDetails));
router.get('/cp/logs', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.getCallLogs));
router.post('/cp/phonecall', index_1.jwtAuth, index_1.validateSubscription, (0, catchAysncError_1.default)(cloudPhoneController.phoneCall));
router.get('/user/me', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.getSingleUserInfo));
router.get('/v2/users', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.getUsersDetails));
router.post('/cp/hangup', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.killCallConference));
router.get('/application/sipcalls', (0, catchAysncError_1.default)(cloudPhoneController.applicationForSip));
router.post('/cp/transfer', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.transferCall));
router.get('/getConferenceRoomForTranferCall/:customer_number/:url', cloudPhoneController.getConferenceRoomForTransfercall);
router.post('/cp/hangup/transfer', (0, catchAysncError_1.default)(cloudPhoneController.hangupTransferCallAndSaveCdr));
router.post('/cp/hold', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.handleHoldOrUnhold));
router.post('/cp/killcall', index_1.jwtAuth, (0, catchAysncError_1.default)(cloudPhoneController.killParticularCall));
//VoiceMail
router.post('/voiceMail/create', index_1.jwtAuth, (0, catchAysncError_1.default)(voiceMail.createVoiceMailBox));
router.patch('/voiceMail/update/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(voiceMail.updateVoiceMailBox));
router.delete('/voiceMail/delete/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(voiceMail.deleteVoiceMailBox));
router.get('/voiceMail/getAll', index_1.jwtAuth, (0, catchAysncError_1.default)(voiceMail.getAllVoiceMailBoxes));
router.get('/voiceMail/get/:id', index_1.jwtAuth, index_1.checkFormatOfId, (0, catchAysncError_1.default)(voiceMail.getVoiceMailBoxById));
router.get('/voiceMail/records', index_1.jwtAuth, (0, catchAysncError_1.default)(voiceMail.getVoiceMailRecordByName));
router.all('*', (req, res, next) => {
    const err = new BaseException_1.default(404, `Invalid URI path found : ${req.path}`, 'INVALID_URI');
    next(err);
    return res.status(404).json({ "message": "Invalid URL!" });
});
exports.default = router;
//# sourceMappingURL=index.js.map