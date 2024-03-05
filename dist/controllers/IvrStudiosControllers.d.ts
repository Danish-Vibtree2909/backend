import Controller from "./Index";
import { IRequest, IResponse } from "../types/IExpress";
import AWS from "aws-sdk";
import { dataFromVibconnectForIncoming } from "../helper/callXmlGenerator";
export default class IvrStudiosController extends Controller {
    constructor(model?: any);
    xmlGenerator(req: IRequest, res: IResponse): Promise<any>;
    downloadFile: (bucketName: string, filePath: string) => Promise<void | import("aws-sdk/lib/request").PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>>;
    downloadRecording(req: IRequest, res: IResponse): Promise<any>;
    obtainFileName(fileUrl: string): string;
    deleteAudioFromS3(req: IRequest, res: IResponse): Promise<any>;
    convertObjectToQueryString(obj: any): string;
    getVibconnectDataAndModefiy(req: IRequest, res: IResponse): Promise<any>;
    checkIfCustomerInLine(req: IRequest, res: IResponse): Promise<any>;
    getConferenceRoom(req: IRequest, res: IResponse): Promise<any>;
    sendCompletedMessageThree(auth_id: any, auth_secret: any, from: any, pe_id: any, body: any, to: any): Promise<unknown>;
    sendMessageToDomestic(auth_id: any, auth_secret: any, from: any, pe_id: any, template_id: any, body: any, to: any): Promise<unknown>;
    updateRealTimeDataOfIvrStudiousForApiCall: (query: any, updates: any) => Promise<void>;
    loopOverNumberToGetAvailableNumberOfAgent: (arrayOfAgentNumbers: any[]) => Promise<any>;
    timeout: (ms: any) => Promise<unknown>;
    sleep: (fn: any, ...args: any) => Promise<any>;
    getConferenceSidAndEndConference: (ParentCallSid: string, authId: string, authSecretid: string) => Promise<any>;
    endConference(auth_id: string, authSecret_id: string, conference_id: string): Promise<any>;
    findConferenceIdUsingParentCallId: (parentCallId: string, authId: string, authSecretId: string) => Promise<any>;
    extractAllNumberOfCorrespondingUser: (detailsOfNumbersFromUI: any) => Promise<any>;
    handleGenerateRecordXml: (targetNode: any, detailsFromVibconnect: any, id: any, nextNode: any) => Promise<any>;
    checkChildCallStatusOfPreviousCall: (parentCallSid: any) => Promise<{
        status: boolean;
        data: {};
    }>;
    handleMultiPartyCallDistributionOfTypeRoundRobin: (targetNode: any, dataFromVibconnect: any, id?: any) => Promise<any>;
    handleMultiPartyCallDistributionProcess: (targetNode: any, dataFromVibconnect: any, id?: any) => Promise<any>;
    runApiRequestInBackground: (detailsOfTargetNode: any, id: any, customer?: any) => Promise<void>;
    findTargetsFromSource(allNodes: any, source: string): any;
    findIfTargetIsFunction(allNodes: any, nodesWithSameSource: any): any;
    convertArrayToJson(arr: any, customer?: any): any;
    collectDetailsAndMakeRequest(details: any, customer?: any): Promise<unknown>;
    destructuringNestedArrayAndGiveValue(array: any, responseObject: any, key: any): {
        key: any;
        value: string;
    };
    filterVariablesFromResponse(variableArray: any, responseObject: any): {
        key: any;
        value: string;
    }[];
    removeFunctionNodeIdFromNextNode(allNodes: any, filteredNode: any): string;
    checkTheNumberContainsSymbolOrNOT(number: any): any;
    getNameOfDay(num: any): " " | "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
    getStartAndEndTimeFromMultipleTimeInSingleDay(data: any, currentTime: any): {
        startTime: string | undefined;
        endTime: string | undefined;
    };
    zohoIntegerationForParticularClient: (data: any) => Promise<unknown>;
    createIvrFlowAccordingToUIFlowVersionTwo(req: IRequest, res: IResponse): Promise<any>;
    getOrCreateContact: (data: dataFromVibconnectForIncoming) => Promise<void>;
    getRealTimeData(req: IRequest, res: IResponse): Promise<any>;
    protected MakeConferenceCall(auth_id: string, authSecret_id: string, body: any): Promise<any>;
    numberNotInService(req: IRequest, res: IResponse): Promise<any>;
    getListOfConference(auth_id: string, authSecret_id: string): Promise<any>;
    getTargetNodeAndExecuteVersionTwo(req: IRequest, res: IResponse, next: any): Promise<any>;
}
//# sourceMappingURL=IvrStudiosControllers.d.ts.map