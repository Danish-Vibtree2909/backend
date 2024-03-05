"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
mongoose.Types.ObjectId.isValid('your id here');
const UserPermissionUserModel = new mongoose_1.Schema({
    is_verified: {
        type: String,
        required: true,
        default: false,
    },
    is_powerdialer_active: {
        type: Boolean,
        required: false,
        default: false,
    },
    api_token_list: {
        type: Array,
        required: false,
    },
    is_logged_in: {
        type: Boolean,
        required: false,
    },
    is_kyc_done: {
        type: Boolean,
        required: true,
        default: false,
    },
    user_logo: {
        type: String,
        required: false
    },
    blocked: {
        type: Boolean,
        required: true,
        default: false,
    },
    username: {
        type: String,
        required: true,
        default: false,
    },
    gupshupId: {
        type: String,
        required: false
    },
    gupshupPassword: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true,
        default: "Active",
    },
    email: {
        type: String,
        required: true,
        default: false,
    },
    EmailInVibconnect: {
        type: String,
        required: true,
        default: false
    },
    fullName: {
        type: String,
        required: true,
        default: false,
    },
    FirstName: {
        type: String,
        required: true,
        default: "",
    },
    LastName: {
        type: String,
        required: false,
        default: "",
    },
    password: {
        type: String,
        required: false,
        default: null
    },
    phone: {
        type: String,
        required: true,
        default: false,
    },
    provider: {
        type: String,
        required: false,
    },
    company: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'companies'
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'role'
    },
    user_type: {
        type: String,
        required: true,
        default: false,
    },
    auth_id: {
        type: String,
        required: true,
        default: false,
    },
    auth_secret: {
        type: String,
        required: true,
        default: false,
    },
    company_id: {
        type: String,
        required: true,
        default: false,
    },
    company_name: {
        type: String,
        required: false,
    },
    is_admin: {
        type: String,
        required: true,
        default: false,
    },
    user_invoices: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'user_invoices'
        }],
    tickets: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'tickets'
        }],
    products: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'products'
        }],
    kycDocuments: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'kycdocuments'
        }],
    country_allowed: [{
            code: {
                type: String,
                required: false,
                default: null
            },
            phone: {
                type: String,
                required: false,
                default: null
            }
        }],
    Tags: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            backgroundColor: {
                type: String,
                required: false,
                default: null
            },
        }],
    sip_default: {
        country: {
            type: String,
            required: false,
        },
        number: {
            type: String,
            required: false,
        },
        pattern: {
            type: String,
            required: false
        }
    },
    subscription_type: {
        type: String,
        required: false
    },
    phone_allowed: {
        type: Boolean,
        required: true,
        default: true,
    },
    browser_allowed: {
        type: Boolean,
        required: true,
        default: true,
    },
    sip_allowed: {
        type: Boolean,
        required: true,
        default: true,
    },
    sip_user: {
        type: String,
        required: false,
        default: null
    },
    sip_password: {
        type: String,
        required: false,
        default: null
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    linkedin_url: {
        type: String,
        required: true,
        default: false,
    },
    company_grade: {
        type: String,
        required: true,
        default: false,
    },
    lineForwardAppId: {
        type: Number,
        required: false,
    },
    lineForwardAppSid: {
        type: String,
        required: false,
    },
    CloudPhoneAppId: {
        type: Number,
        required: false,
    },
    CloudPhoneAppSid: {
        type: String,
        required: false,
    },
    IvrStudioAppId: {
        type: Number,
        required: false,
    },
    IvrStudioAppSid: {
        type: String,
        required: false,
    },
    CancelNumberAppId: {
        type: Number,
        required: false,
    },
    CancelNumberAppSid: {
        type: String,
        required: false,
    },
    SipUserAppId: {
        type: Number,
        required: false,
    },
    SipUserAppSid: {
        type: String,
        required: false,
    },
    selectedColumnForAdmin: {
        lineforwardCheck: {
            callStatus: {
                type: Boolean,
                default: true,
                required: false
            },
            numbers: {
                type: Boolean,
                default: true,
                required: false
            },
            recording: {
                type: Boolean,
                default: true,
                required: false
            },
            callTags: {
                type: Boolean,
                default: true,
                required: false
            },
            caller: {
                type: Boolean,
                default: true,
                required: false
            },
            forwardTo: {
                type: Boolean,
                default: true,
                required: false
            },
            startTime: {
                type: Boolean,
                default: true,
                required: false
            },
            duration: {
                type: Boolean,
                default: true,
                required: false
            }
        },
        callTrackingCheck: {
            callStatusCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            numbersCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            recordingCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            callTagsCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            campaignCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            callerCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            routeToCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            startTimeCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            durationCallTracking: {
                type: Boolean,
                default: true,
                required: false
            }
        },
        cloudPhoneCheck: {
            callstatuscloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            numberscloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            recordingcloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            callTagscloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            usercloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            userTypecloudPhone: {
                type: Boolean,
                default: true,
                required: false
            },
            callercloudPhone: {
                type: Boolean,
                default: true,
                required: false
            },
            recievercloudPhone: {
                type: Boolean,
                default: true,
                required: false
            },
            startTimecloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            durationcloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
        },
        ivrCheck: {
            callStatusIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            callerIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            recordingIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            callTagsIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            flowNameIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            numbersIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            recieverIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            startTimeIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            durationIvr: {
                type: Boolean,
                default: true,
                required: false
            }
        }
    },
    selectedColumnForUser: {
        lineforwardCheck: {
            callStatus: {
                type: Boolean,
                default: true,
                required: false
            },
            numbers: {
                type: Boolean,
                default: true,
                required: false
            },
            recording: {
                type: Boolean,
                default: true,
                required: false
            },
            callTags: {
                type: Boolean,
                default: true,
                required: false
            },
            caller: {
                type: Boolean,
                default: true,
                required: false
            },
            forwardTo: {
                type: Boolean,
                default: true,
                required: false
            },
            startTime: {
                type: Boolean,
                default: true,
                required: false
            },
            duration: {
                type: Boolean,
                default: true,
                required: false
            }
        },
        callTrackingCheck: {
            callStatusCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            numbersCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            recordingCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            callTagsCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            campaignCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            callerCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            routeToCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            startTimeCallTracking: {
                type: Boolean,
                default: true,
                required: false
            },
            durationCallTracking: {
                type: Boolean,
                default: true,
                required: false
            }
        },
        cloudPhoneCheck: {
            callstatuscloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            numberscloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            recordingcloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            callTagscloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            usercloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            userTypecloudPhone: {
                type: Boolean,
                default: true,
                required: false
            },
            callercloudPhone: {
                type: Boolean,
                default: true,
                required: false
            },
            recievercloudPhone: {
                type: Boolean,
                default: true,
                required: false
            },
            startTimecloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
            durationcloudphone: {
                type: Boolean,
                default: true,
                required: false
            },
        },
        ivrCheck: {
            callStatusIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            callerIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            recordingIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            callTagsIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            flowNameIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            numbersIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            recieverIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            startTimeIvr: {
                type: Boolean,
                default: true,
                required: false
            },
            durationIvr: {
                type: Boolean,
                default: true,
                required: false
            }
        }
    },
    ivrColumnSettings: [
        {
            type: mongoose_1.Schema.Types.Mixed,
            required: false,
        }
    ],
    lastViewOption: {
        type: String,
        default: 'Ivr',
        required: false
    },
    assignedNumber: [
        {
            type: String,
            required: false
        }
    ],
    Role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
    },
    viewType: {
        type: String,
        default: 'All',
        required: false
    },
    callBackNumber: {
        type: String,
        required: false
    },
    callBackActive: {
        type: Boolean,
        default: false,
        required: true
    },
    callBackAlertMessage: {
        type: String,
        required: false
    },
    TryCount: {
        type: Number,
        default: 3,
        required: true
    },
    uniqueId: {
        type: String,
        required: false
    },
    otp: {
        type: String,
        required: false
    },
    timeFormat: {
        type: String,
        required: false
    },
    customerIdInZoho: {
        type: String,
        required: false
    },
    aadharNo: {
        type: String,
        required: false
    },
    ivrColumn: {
        CallStatus: {
            type: Boolean,
            required: false,
            default: true
        },
        From: {
            type: Boolean,
            required: false,
            default: true
        },
        FlowName: {
            type: Boolean,
            required: false,
            default: true
        },
        Tags: {
            type: Boolean,
            required: false,
            default: true
        },
        CloudNumber: {
            type: Boolean,
            required: false,
            default: true
        },
        User: {
            type: Boolean,
            required: false,
            default: true
        },
        status: {
            type: Boolean,
            required: false,
            default: true
        },
        reciever: {
            type: Boolean,
            required: false,
            default: true
        },
        startTime: {
            type: Boolean,
            required: false,
            default: true
        },
        TalkTime: {
            type: Boolean,
            required: false,
            default: true
        },
        action: {
            type: Boolean,
            required: false,
            default: true
        },
        recording: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    timeZone: {
        type: String,
        required: false
    },
    contactColumnSettings: [
        {
            type: mongoose_1.Schema.Types.Mixed,
            required: false,
        }
    ],
    contactColumn: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    inboxVoiceStatus: [
        {
            type: mongoose_1.Schema.Types.Mixed,
            required: false,
        }
    ],
    display_name: {
        type: String,
        required: false
    },
    sip_cli: {
        type: String,
        required: false
    },
    alternate_number: {
        type: String,
        required: false
    },
    is_login_sip: {
        type: Boolean,
        required: false,
        default: false
    },
    max_session: {
        type: Number,
        required: false,
        default: 0
    },
    active_session: {
        type: Number,
        required: false,
        default: 0
    },
});
exports.default = (0, mongoose_1.model)('user', UserPermissionUserModel, 'users-permissions_user');
//# sourceMappingURL=UserPermissionUserModel.js.map