import { Document } from 'mongoose';
export default interface company extends Document {
    name: string;
    industry: string;
    email: string;
    phone: string;
    linkedin: string;
    grade: string;
    isActive: boolean;
    billing_address: {
        building_name: string;
        street: string;
        city: string;
        state: string;
        zipcode: string;
        country: string;
    };
    shipping_address: {
        building_name: string;
        street: string;
        city: string;
        state: string;
        zipcode: string;
        country: string;
    };
    notes: string;
    documents: string[];
    type: string;
    activated_services: any;
    is_phone_verified: boolean;
    is_email_verified: boolean;
    documentStatus: [{
        status: string;
        reason: string;
    }];
    contact_name: string;
    company_size: string;
    company_logo: string;
}
//# sourceMappingURL=companyType.d.ts.map