require('dotenv').config()
export const SALT : string = process.env.SALT!
export const TOKEN_EXPIRE : string = process.env.TOKEN_EXPIRE!
export const MAIL_FROM : string = process.env.MAIL_FROM!
export const MAIL_NAME : string = process.env.MAIL_NAME!
export const FILE_UPLOAD_PATH :string = process.cwd() + '\\upload'
export const TZ : string = process.env.TZ!
export const NODE_ENV: string = process.env.NODE_ENV!
export const jwtSecret: string=process.env.JWT_SECRET!
export const BaseUrl: string= process.env.BaseUrl!
export const  AWS_ACCESS_KEY :string = process.env.AWS_ACCESS_KEY!
export const  AWS_SECRET_ACCESS_KEY :string = process.env.AWS_SECRET_ACCESS_KEY!
export const  AWS_BUCKET_NAME :string = process.env.playgreeting!

export const AWS_ACCESS_KEY_RECORDINGS = process.env.AWS_ACCESS_KEY_RECORDINGS
export const AWS_SECRET_ACCESS_KEY_RECORDINGS = process.env.AWS_SECRET_ACCESS_KEY_RECORDINGS
export const AWS_BUCKET_NAME_RECORDINGS = process.env.AWS_BUCKET_NAME_RECORDINGS

export const AWS_ACCESS_KEY_POLLY = process.env.AWS_ACCESS_KEY_POLLY
export const AWS_SECRET_ACCESS_KEY_POLLY = process.env.AWS_SECRET_ACCESS_KEY_POLLY
export const AWS_REGION_POLLY = process.env.AWS_REGION_POLLY

export const SMTP_LINK = process.env.SMTP_LINK
export const SMTP_SENDER_NAME = process.env.SMTP_SENDER_NAME
export const SMTP_SENDER_EMAIL = process.env.SMTP_SENDER_EMAIL
export const SMTP_SUBJECT = process.env.SMTP_SUBJECT
export const SMTP_API_KEY = process.env.SMTP_API_KEY
export const SMTP_API_KEY_FEEDBACK = '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'
export const SMTP_SENDER_EMAIL_FEEDBACK = 'feedback@vibtree.com'

export const VIBCONNECT_ADMIN = process.env.VIBCONNECT_ADMIN
export const VIBCONNECT_SECRET = process.env.VIBCONNECT_SECRET
export const VIBCONNECT_AUTH_TOKEN = process.env.VIBCONNECT_AUTH_TOKEN

export const JWT_SECRET = process.env.JWT_SECRET
export const BASE_URL = process.env.DEV_BASE_URL

export const STATUS_CALL_BACK = {
  answerOnBridge: true,
  //changing config to receive incoming call data of call-forwarding to CLOUD-PHONE socket
  // statusCallback: 'https://crm-backend-non-strapi.herokuapp.com/status',
  statusCallback: `${process.env.BaseUrl}/api/webhooks/vibconnect/cp/phone`,
  // statusCallback: 'https://crm-backend-non-strapi.herokuapp.com/webhooks/vibconnect/cp/phone',
  statusCallbackEvent: 'initiated, ringing, answered, completed',
  statusCallbackMethod: 'POST'
}

export const STATUS_CALL_BACK_LINE_FORWARDING = {
  answerOnBridge: true,
  //changing config to receive incoming call data of call-forwarding to LINE_FORWARDING socket
  // statusCallback: 'https://crm-backend-non-strapi.herokuapp.com/webhook/vibconnect/line_forwarding',
  statusCallback: `${process.env.BaseUrl}/api/webhook/vibconnect/line_forwarding`,
  statusCallbackEvent: 'initiated, ringing, answered, completed',
  statusCallbackMethod: 'POST'
}


export const STATUS_CALL_BACK_IVR_STUDIO = {
  answerOnBridge: true,
  //changing config to receive incoming call data of call-forwarding to LINE_FORWARDING socket
  statusCallback: `${process.env.BaseUrl}/api/webhook/vibconnect/ivr_studios`,
  statusCallbackEvent: 'initiated, ringing, answered, completed',
  statusCallbackMethod: 'POST'
}

export const TAGS_DATA_FOR_RECORDINGS = [
  {
    tag : 'mibs',
    rec_url : 'https://s3proxy.mm.vibconnect.io/call_recordings',
    key : 'admin',
    secret : 'dVMxkR3d0srEYRIMsY92',
    auth_type : 'Basic '
  },
  {
    tag : 'vibtree',
    rec_url : 'https://vibtree-call-recording.s3.eu-central-1.amazonaws.com',
    key : '',
    secret : '',
    auth_type : 'no-auth'
  }
]

export const VIBTREE_API_KEY_FOR_SOBOT = process.env.VIBTREE_API_KEY_FOR_SOBOT
export const VIBTREE_SECRET_KET_FOR_SOBOT = process.env.VIBTREE_SECRET_KET_FOR_SOBOT
export const SOBOT_BASE_URL = process.env.SOBOT_BASE_URL
export const VIBTREE_WHATSAPP_ACCESS_TOKEN = process.env.VIBTREE_WHATSAPP_ACCESS_TOKEN

export const AUTH_ID_FOR_OTP = process.env.AUTH_ID_FOR_OTP
export const AUTH_SECRET_FOR_OTP = process.env.AUTH_SECRET_FOR_OTP

export const GUPSHUP_ID = process.env.GUPSHUP_ID
export const GUPSHUP_PASSWORD = process.env.GUPSHUP_PASSWORD

export const GOOGLE_CLIENT_ID = "697496545273-07pu29ropekg4a2350p334ocn6igvvph.apps.googleusercontent.com"
export const GOOGLE_CLIENT_SECRET = "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"
export const GOOGEL_OAUTH_REDIRECT_URI =  'http://localhost:8080/api/session/oauth/google'

export const THINQ_BASEURL = process.env.THINQ_BASEURL
export const  THINQ_USER = process.env.THINQ_USER
export const  THINQ_SECRET = process.env.THINQ_SECRET
export const THINQ_ACCOUNT_ID = process.env.THINQ_ACCOUNT_ID
export const  THINQ_ROUTE_ID = process.env.THINQ_ROUTE_ID

export const AWS_CLOUDWATCH_KEY = process.env.AWS_CLOUDWATCH_KEY
export const AWS_CLOUDWATCH_SECRET = process.env.AWS_CLOUDWATCH_SECRET
export const AWS_CLOUDWATCH_REGION = process.env.AWS_CLOUDWATCH_REGION
export const  AWS_GROUP_NAME = process.env.AWS_GROUP_NAME
export const  AWS_STREAM_NAME = process.env.AWS_STREAM_NAME
export const ZOHO_INTEGERATION_URL = process.env.ZOHO_INTEGERATION_URL