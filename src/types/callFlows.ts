import { Document } from 'mongoose'
import { ICountryCode } from './SaveType'
import ICallFlowSaperate from './ICallFlowSaperate'
interface ICloudNumber{
    number: string;
    countryCode:ICountryCode;

}

interface CallInitiate extends ICloudNumber{
    record: boolean
}

interface IAudio {
    type: string;
    file: string;
}

interface IFlowObject{
    elements: ICallFlowSaperate[];
    position: Array<number>;
    zoom: number
}

export default interface ICallFlows extends Document{
    authId: string;
    title: string;
    flowObject: IFlowObject;

    cloudNumber:ICloudNumber;
    callInitiate: CallInitiate;

    audio: IAudio;
    callFlow?: string;
    createdAt: Date;
    updatedAt: Date;
}
