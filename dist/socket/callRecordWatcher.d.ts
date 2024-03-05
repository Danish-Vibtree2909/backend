import { ChangeStreamOptions } from "mongodb";
import { CallSource } from "../services/CallStatService/CallStatsService";
import { CallStatSummary } from "../services/CallStatService";
export declare function watchAllCallCollection(config: ChangeStreamOptions, callback: (stats: CallStatSummary[], account: string, source: CallSource) => void): void;
//# sourceMappingURL=callRecordWatcher.d.ts.map