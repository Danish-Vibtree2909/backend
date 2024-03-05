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
import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
export default class CloudPhoneController extends Controller {
    constructor(model?: any);
    applicationForSip(req: IRequest, res: IResponse): Promise<any>;
    getConferenceRoomForCloudPhoneWebrtc(req: IRequest, res: IResponse): Promise<any>;
    getConferenceRoomForCloudPhone(req: IRequest, res: IResponse): Promise<any>;
    editNotesOrTags(req: IRequest, res: IResponse): Promise<any>;
    Call(req: IRequest, res: IResponse): Promise<any>;
    getCloudNumbers(req: IRequest, res: IResponse): Promise<any>;
    killCallConference(req: IRequest, res: IResponse): Promise<any>;
    singleContactDetails(req: IRequest, res: IResponse): Promise<any>;
    getUsersDetails(req: IRequest, res: IResponse): Promise<any>;
    phoneCall(req: IRequest, res: IResponse): Promise<any>;
    getSingleUserInfo(req: IRequest, res: IResponse): Promise<any>;
    getCallLogs(req: IRequest, res: IResponse): Promise<any>;
    getConferenceRoomForTransfercall(req: IRequest, res: IResponse): Promise<any>;
    transferCall(req: IRequest, res: IResponse): Promise<any>;
    hangupTransferCallAndSaveCdr(req: IRequest, res: IResponse): Promise<any>;
    getRecordingSid: (arr: any) => Promise<string | undefined>;
    createSummaryOfChildCall: (childArray: any) => Promise<Object | null>;
    formatCallStatusObjectFromArray(ivrFlow: any): any;
    findUserNameFromNumber: (number: any, authId: any) => Promise<{
        name: string;
        userId: any;
    }>;
    findContactNameFromNumber: (number: any, authId: any) => Promise<{
        name: any;
        contactId: any;
    }>;
    useArrayOfChildCallsToMakeChildCallLifeCycle: (arr: any) => Promise<any>;
    sortArrayOfChildCallsAccordingTotime(arrayOfChildCalls: any): any;
    makeObjectFromArrayOfObjects: (ivrFlow: any) => Promise<any>;
    calculateQueueTimeForParticularCall: (arr: any) => any;
    calculateFinalStatus: (data: any) => string;
    useNumberToFindDetailsOfCloudNumber: (number: any) => Promise<(import("mongoose").Document<unknown, {}, {
        [x: string]: any;
    }> & Omit<{
        [x: string]: any;
    } & Required<{
        _id: unknown;
    }>, never>)[]>;
    useNumberToFoundDetailsOfContacts: (number: any, AccountSid: any) => Promise<any>;
    getCountryCode: (input: any) => any;
    checkDataFormatAndAddPlusToAllNumber: (data: any) => any;
    createALogFortransferCall: (body: any) => Promise<void>;
    handleHoldOrUnhold(req: IRequest, res: IResponse): Promise<any>;
    killParticularCall(req: IRequest, res: IResponse): Promise<any>;
}
//# sourceMappingURL=CloudPhoneController.d.ts.map