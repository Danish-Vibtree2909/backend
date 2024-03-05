"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THINQ_ROUTE_ID = exports.THINQ_ACCOUNT_ID = exports.THINQ_SECRET = exports.THINQ_USER = exports.THINQ_BASEURL = exports.GOOGEL_OAUTH_REDIRECT_URI = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.GUPSHUP_PASSWORD = exports.GUPSHUP_ID = exports.AUTH_SECRET_FOR_OTP = exports.AUTH_ID_FOR_OTP = exports.VIBTREE_WHATSAPP_ACCESS_TOKEN = exports.SOBOT_BASE_URL = exports.VIBTREE_SECRET_KET_FOR_SOBOT = exports.VIBTREE_API_KEY_FOR_SOBOT = exports.TAGS_DATA_FOR_RECORDINGS = exports.STATUS_CALL_BACK_IVR_STUDIO = exports.STATUS_CALL_BACK_LINE_FORWARDING = exports.STATUS_CALL_BACK = exports.BASE_URL = exports.JWT_SECRET = exports.VIBCONNECT_AUTH_TOKEN = exports.VIBCONNECT_SECRET = exports.VIBCONNECT_ADMIN = exports.SMTP_SENDER_EMAIL_FEEDBACK = exports.SMTP_API_KEY_FEEDBACK = exports.SMTP_API_KEY = exports.SMTP_SUBJECT = exports.SMTP_SENDER_EMAIL = exports.SMTP_SENDER_NAME = exports.SMTP_LINK = exports.AWS_REGION_POLLY = exports.AWS_SECRET_ACCESS_KEY_POLLY = exports.AWS_ACCESS_KEY_POLLY = exports.AWS_BUCKET_NAME_RECORDINGS = exports.AWS_SECRET_ACCESS_KEY_RECORDINGS = exports.AWS_ACCESS_KEY_RECORDINGS = exports.AWS_BUCKET_NAME = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY = exports.BaseUrl = exports.jwtSecret = exports.NODE_ENV = exports.TZ = exports.FILE_UPLOAD_PATH = exports.MAIL_NAME = exports.MAIL_FROM = exports.TOKEN_EXPIRE = exports.SALT = void 0;
exports.ZOHO_INTEGERATION_URL = exports.AWS_STREAM_NAME = exports.AWS_GROUP_NAME = exports.AWS_CLOUDWATCH_REGION = exports.AWS_CLOUDWATCH_SECRET = exports.AWS_CLOUDWATCH_KEY = void 0;
require('dotenv').config();
exports.SALT = process.env.SALT;
exports.TOKEN_EXPIRE = process.env.TOKEN_EXPIRE;
exports.MAIL_FROM = process.env.MAIL_FROM;
exports.MAIL_NAME = process.env.MAIL_NAME;
exports.FILE_UPLOAD_PATH = process.cwd() + '\\upload';
exports.TZ = process.env.TZ;
exports.NODE_ENV = process.env.NODE_ENV;
exports.jwtSecret = process.env.JWT_SECRET;
exports.BaseUrl = process.env.BaseUrl;
exports.AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
exports.AWS_BUCKET_NAME = process.env.playgreeting;
exports.AWS_ACCESS_KEY_RECORDINGS = process.env.AWS_ACCESS_KEY_RECORDINGS;
exports.AWS_SECRET_ACCESS_KEY_RECORDINGS = process.env.AWS_SECRET_ACCESS_KEY_RECORDINGS;
exports.AWS_BUCKET_NAME_RECORDINGS = process.env.AWS_BUCKET_NAME_RECORDINGS;
exports.AWS_ACCESS_KEY_POLLY = process.env.AWS_ACCESS_KEY_POLLY;
exports.AWS_SECRET_ACCESS_KEY_POLLY = process.env.AWS_SECRET_ACCESS_KEY_POLLY;
exports.AWS_REGION_POLLY = process.env.AWS_REGION_POLLY;
exports.SMTP_LINK = process.env.SMTP_LINK;
exports.SMTP_SENDER_NAME = process.env.SMTP_SENDER_NAME;
exports.SMTP_SENDER_EMAIL = process.env.SMTP_SENDER_EMAIL;
exports.SMTP_SUBJECT = process.env.SMTP_SUBJECT;
exports.SMTP_API_KEY = process.env.SMTP_API_KEY;
exports.SMTP_API_KEY_FEEDBACK = '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';
exports.SMTP_SENDER_EMAIL_FEEDBACK = 'feedback@vibtree.com';
exports.VIBCONNECT_ADMIN = process.env.VIBCONNECT_ADMIN;
exports.VIBCONNECT_SECRET = process.env.VIBCONNECT_SECRET;
exports.VIBCONNECT_AUTH_TOKEN = process.env.VIBCONNECT_AUTH_TOKEN;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.BASE_URL = process.env.DEV_BASE_URL;
exports.STATUS_CALL_BACK = {
    answerOnBridge: true,
    //changing config to receive incoming call data of call-forwarding to CLOUD-PHONE socket
    // statusCallback: 'https://crm-backend-non-strapi.herokuapp.com/status',
    statusCallback: `${process.env.BaseUrl}/api/webhooks/vibconnect/cp/phone`,
    // statusCallback: 'https://crm-backend-non-strapi.herokuapp.com/webhooks/vibconnect/cp/phone',
    statusCallbackEvent: 'initiated, ringing, answered, completed',
    statusCallbackMethod: 'POST'
};
exports.STATUS_CALL_BACK_LINE_FORWARDING = {
    answerOnBridge: true,
    //changing config to receive incoming call data of call-forwarding to LINE_FORWARDING socket
    // statusCallback: 'https://crm-backend-non-strapi.herokuapp.com/webhook/vibconnect/line_forwarding',
    statusCallback: `${process.env.BaseUrl}/api/webhook/vibconnect/line_forwarding`,
    statusCallbackEvent: 'initiated, ringing, answered, completed',
    statusCallbackMethod: 'POST'
};
exports.STATUS_CALL_BACK_IVR_STUDIO = {
    answerOnBridge: true,
    //changing config to receive incoming call data of call-forwarding to LINE_FORWARDING socket
    statusCallback: `${process.env.BaseUrl}/api/webhook/vibconnect/ivr_studios`,
    statusCallbackEvent: 'initiated, ringing, answered, completed',
    statusCallbackMethod: 'POST'
};
exports.TAGS_DATA_FOR_RECORDINGS = [
    {
        tag: 'mibs',
        rec_url: 'https://s3proxy.mm.vibconnect.io/call_recordings',
        key: 'admin',
        secret: 'dVMxkR3d0srEYRIMsY92',
        auth_type: 'Basic '
    },
    {
        tag: 'vibtree',
        rec_url: 'https://vibtree-call-recording.s3.eu-central-1.amazonaws.com',
        key: '',
        secret: '',
        auth_type: 'no-auth'
    }
];
exports.VIBTREE_API_KEY_FOR_SOBOT = process.env.VIBTREE_API_KEY_FOR_SOBOT;
exports.VIBTREE_SECRET_KET_FOR_SOBOT = process.env.VIBTREE_SECRET_KET_FOR_SOBOT;
exports.SOBOT_BASE_URL = process.env.SOBOT_BASE_URL;
exports.VIBTREE_WHATSAPP_ACCESS_TOKEN = process.env.VIBTREE_WHATSAPP_ACCESS_TOKEN;
exports.AUTH_ID_FOR_OTP = process.env.AUTH_ID_FOR_OTP;
exports.AUTH_SECRET_FOR_OTP = process.env.AUTH_SECRET_FOR_OTP;
exports.GUPSHUP_ID = process.env.GUPSHUP_ID;
exports.GUPSHUP_PASSWORD = process.env.GUPSHUP_PASSWORD;
exports.GOOGLE_CLIENT_ID = "697496545273-07pu29ropekg4a2350p334ocn6igvvph.apps.googleusercontent.com";
exports.GOOGLE_CLIENT_SECRET = "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";
exports.GOOGEL_OAUTH_REDIRECT_URI = 'http://localhost:8080/api/session/oauth/google';
exports.THINQ_BASEURL = process.env.THINQ_BASEURL;
exports.THINQ_USER = process.env.THINQ_USER;
exports.THINQ_SECRET = process.env.THINQ_SECRET;
exports.THINQ_ACCOUNT_ID = process.env.THINQ_ACCOUNT_ID;
exports.THINQ_ROUTE_ID = process.env.THINQ_ROUTE_ID;
exports.AWS_CLOUDWATCH_KEY = process.env.AWS_CLOUDWATCH_KEY;
exports.AWS_CLOUDWATCH_SECRET = process.env.AWS_CLOUDWATCH_SECRET;
exports.AWS_CLOUDWATCH_REGION = process.env.AWS_CLOUDWATCH_REGION;
exports.AWS_GROUP_NAME = process.env.AWS_GROUP_NAME;
exports.AWS_STREAM_NAME = process.env.AWS_STREAM_NAME;
exports.ZOHO_INTEGERATION_URL = process.env.ZOHO_INTEGERATION_URL;
//# sourceMappingURL=index.js.map