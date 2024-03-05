import { Document } from 'mongoose'
export default interface JWTAuthInterface extends Document {
    _id: string,
    authId: string,
    companyId: string,
    iat: any,
    exp: any
}
