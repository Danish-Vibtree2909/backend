"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userRealTimeSchema = new mongoose_1.Schema({
    AccountSid: {
        type: String,
        required: false
    },
    AccountSecretId: {
        type: String,
        required: false
    },
    To: {
        type: String,
        required: false
    },
    From: {
        type: String,
        required: false
    },
    CloudNumber: {
        type: String,
        required: false
    },
    ConferenceSid: {
        type: String,
        required: false
    },
    ConferenceStatus: {
        type: String,
        required: false
    },
    FriendlyName: {
        type: String,
        required: false
    },
    ParentCallSid: {
        type: String,
        required: false
    },
    ChildCallId: {
        type: String,
        required: false
    },
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user'
    },
    ContactId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contact',
        required: false
    },
    UserStartTime: {
        type: String,
        required: false
    },
    ParticipantCount: {
        type: String,
        required: false
    },
    ContactStartTime: {
        type: String,
        required: false
    },
    ContactNumber: {
        type: String,
        required: false
    },
    ContactName: {
        type: String,
        required: false
    },
    ContactStatus: {
        type: String,
        required: false
    },
    ContactParticipantId: {
        type: String,
        required: false
    },
    Tags: [{
            name: {
                type: String,
                required: false,
                trim: true,
            },
            checked: {
                type: Boolean,
                default: false,
                required: false
            },
            backgroundColor: {
                type: String,
                default: '#FFE5B4',
                required: false
            }
        }],
    Notes: [
        {
            value: {
                type: String,
                required: false,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
                required: true
            },
            name: {
                type: String,
                required: false,
            }
        }
    ],
    ConferenceTimeStampArray: [
        {
            type: mongoose_1.Schema.Types.Mixed,
            required: false
        }
    ],
    subscribeDate: {
        type: Date,
        required: true,
        default: Date.now
    },
});
exports.default = (0, mongoose_1.model)('realtime_user', userRealTimeSchema);
//# sourceMappingURL=UserRealtimeModel.js.map