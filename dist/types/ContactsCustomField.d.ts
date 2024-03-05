import { Document } from 'mongoose';
export default interface IContactCustomField extends Document {
    name: string;
    value: any;
    type: string;
    selected_value: any;
    AccountSid: string;
    user_id: any;
    key: string;
}
//# sourceMappingURL=ContactsCustomField.d.ts.map