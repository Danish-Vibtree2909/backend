import { Document } from 'mongoose'
export default interface CustomerInterface extends Document{
    company_name: string;
    type_of_customer: string;
    customer: string;
}
