import { Document } from 'mongoose';
export default interface allMetaDataTypes extends Document {
    object: string;
    entry: [
        {
            id: string;
            changes: [
                {
                    value: {
                        messaging_product: string;
                        metadata: {
                            display_phone_number: string;
                            phone_number_id: string;
                        };
                        statuses?: [
                            {
                                id: string;
                                status: string;
                                timestamp: string;
                                recipient_id: string;
                                conversation: {
                                    id: string;
                                    origin: {
                                        type: string;
                                    };
                                };
                                pricing: any;
                            }
                        ];
                        contacts?: [
                            {
                                profile: {
                                    name: string;
                                };
                                wa_id: string;
                            }
                        ];
                        messages?: [
                            {
                                context?: {
                                    from: string;
                                    id: string;
                                };
                                from: string;
                                id: string;
                                timestamp: string;
                                text: {
                                    body: string;
                                };
                                type: string;
                                interactive?: {
                                    type: string;
                                    list_reply?: {
                                        id: string;
                                        title: string;
                                        description: string;
                                    };
                                    button_reply?: {
                                        id: string;
                                        title: string;
                                    };
                                };
                                order?: {
                                    catalog_id: string;
                                    product_items: [
                                        {
                                            product_retailer_id: string;
                                            quantity: number;
                                            item_price: number;
                                            currency: string;
                                        }
                                    ];
                                };
                                button?: {
                                    payload: string;
                                    text: string;
                                };
                            }
                        ];
                    };
                    field: string;
                }
            ];
        }
    ];
}
//# sourceMappingURL=AllMetaDataTypes.d.ts.map