/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
export declare function getAllVoicemailRecord(queryParams: any): Promise<Omit<import("mongoose").Document<unknown, {}, import("../types/VoiceMailRecordTypes").default> & Omit<import("../types/VoiceMailRecordTypes").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>, never>[]>;
export declare function countDocumentOfVoicemailRecord(queryParams: any): Promise<number>;
export declare function getAllVoicemailBox(queryParams: any): Promise<Omit<import("mongoose").Document<unknown, {}, import("../types/VoiceMailBoxTypes").default> & Omit<import("../types/VoiceMailBoxTypes").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>, never>[]>;
export declare function countDocumentOfVoicemailBox(queryParams: any): Promise<number>;
export declare function getByIdVoicemailBox(id: any, queryParams?: any): Promise<(import("mongoose").Document<unknown, {}, import("../types/VoiceMailBoxTypes").default> & Omit<import("../types/VoiceMailBoxTypes").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>) | null>;
export declare function createVoiceMailBox(data: any): Promise<unknown>;
export declare function findByIdAndUpdateVoicemailBox(query: any, updates: any, options?: any): Promise<false | import("mongoose").ModifyResult<import("mongoose").Document<unknown, {}, import("../types/VoiceMailBoxTypes").default> & Omit<import("../types/VoiceMailBoxTypes").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>>>;
export declare function findByIdAndDeleteVoicemailBox(query: any): Promise<false | (import("mongoose").Document<unknown, {}, import("../types/VoiceMailBoxTypes").default> & Omit<import("../types/VoiceMailBoxTypes").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>) | null>;
//# sourceMappingURL=VoicemailModel.d.ts.map