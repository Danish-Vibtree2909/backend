import { Document } from 'mongoose';
import UserPermissionUserInterface from './userPermissionUser';
export default interface UserInvoiceInterface extends Document {
    referenceId: string;
    invoiceId: boolean;
    invoiceUrl: string;
    mode: string;
    user: UserPermissionUserInterface;
}
//# sourceMappingURL=userInvoiceType.d.ts.map