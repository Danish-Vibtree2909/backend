import { Document, Schema } from 'mongoose';
export default interface IDownloadScrap extends Document {
    setVideoUrlLow: String;
    setVideoUrlHigh: String;
    setVideoHLS: String;
    setThumbUrl: String;
    setThumbUrl169: String;
    setThumbSlide: String;
    setThumbSlideBig: String;
    Scrap: Schema.Types.ObjectId;
    StartedAt: Date;
    EndedAt: Date;
}
//# sourceMappingURL=IDownloadScrap.d.ts.map