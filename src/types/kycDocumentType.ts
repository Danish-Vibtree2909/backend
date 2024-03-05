import { Document } from 'mongoose'

 interface DocumentInterface extends Document{
    fileLocation: string;
    document_type: string;
    status: string;
    rejected_reason: string;
}

export default interface KycDocumentInterface extends Document{
    user_id: string;
    company_type: string;
    documents: Array<DocumentInterface>;
    company: string;
    company_name: string;
    reason: string;
}
