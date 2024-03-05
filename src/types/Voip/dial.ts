import { Document } from 'mongoose'
import { DialAttributes } from 'twilio/lib/twiml/VoiceResponse'
export default interface IDial extends Document, DialAttributes{}
