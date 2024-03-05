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
export declare function getRealtimeCall(queryParams: any): Promise<Omit<import("mongoose").Document<unknown, {}, import("../types/IvrStudiousTypesRealTime").default> & Omit<import("../types/IvrStudiousTypesRealTime").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>, never>[]>;
export declare function getParticularRealtimeCall(queryParams: any): Promise<(import("mongoose").Document<unknown, {}, import("../types/IvrStudiousTypesRealTime").default> & Omit<import("../types/IvrStudiousTypesRealTime").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>) | null>;
export declare function createDetail(data: any): Promise<false | (import("mongoose").Document<unknown, {}, import("../types/IvrStudiousTypesRealTime").default> & Omit<import("../types/IvrStudiousTypesRealTime").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>)>;
export declare function updateRealtimeDetails(query: any, updates: any, options?: any): Promise<import("mongoose").UpdateWriteOpResult>;
export declare function findOneAndDeleteRealtimeDetails(query: any): Promise<(import("mongoose").Document<unknown, {}, import("../types/IvrStudiousTypesRealTime").default> & Omit<import("../types/IvrStudiousTypesRealTime").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>) | null>;
export declare function findManyAndDeleteRealtimeDetails(query: any): Promise<import("mongodb").DeleteResult>;
export declare function getRealtimeCallById(id: any, queryParams?: any): Promise<(import("mongoose").Document<unknown, {}, import("../types/IvrStudiousTypesRealTime").default> & Omit<import("../types/IvrStudiousTypesRealTime").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>) | null>;
export declare function deleteRealtimeDetailsById(id: any): Promise<false | (import("mongoose").Document<unknown, {}, import("../types/IvrStudiousTypesRealTime").default> & Omit<import("../types/IvrStudiousTypesRealTime").default & {
    _id: import("mongoose").Types.ObjectId;
}, never>) | null>;
//# sourceMappingURL=realTimeIvrStudiosModel.d.ts.map