import LineForwardModel from "../../models/LineForwardModel";
import {CallSource} from "../CallStatService/CallStatsService";

type CallStatus = 'completed' | 'failed' | 'missed' | 'cancelled';
export interface InboxRequest {
    numbers?: string;
    caller?: string;
    forwardTo?: string;
    callStatus?: CallStatus[];
    tags?: string[];
    source: CallSource[];
    callTypes?: string[];
    page: number;
    pageSize: number;
}

const lineForwardProjection = {
    $project: {
        subscribeDate: 1,
        Account: '$AccountId',
        CallType: 1,
        CallStatus: 1,
        Numbers: 1,
        Tags: 1,
        Caller: 1,
        ForwardTo: 1,
        StartTime: 1,
        Duration: 1,
        Notes: 1,
        User: null,
        CallInitiatedAt: '$PC_intiated',
        CallAt: '$PC_in_progress',
        CallRouteRingingAt: '$CC_ringing',
        CallRouteConnectedAt: '$CC_in_progress',
        CallRouteCompletedAt: '$CC_completed',
        Recording: '$ChildCallId',
        _id: 1,
        Type: {
            $literal: 'LineForward'
        }
    }
};

// const callTrackingProjection = {
//     $project: {
//         subscribeDate: 1,
//         Account: '$AccountId',
//         CallType: 1,
//         CallStatus: 1,
//         Numbers: 1,
//         Tags: 1,
//         Caller: 1,
//         ForwardTo: 1,
//         StartTime: 1,
//         Duration: 1,
//         Notes: 1,
//         User: null,
//         CallInitiatedAt: '$PC_intiated',
//         CallAt: '$PC_in_progress',
//         CallRouteRingingAt: '$CC_ringing',
//         CallRouteConnectedAt: '$CC_in_progress',
//         CallRouteCompletedAt: '$CC_completed',
//         _id: 0,
//         Type: {
//             $literal: 'lf'
//         }
//     }
// };
//
// const cloudPhoneProjection = {
//     $project: {
//         subscribeDate: 1,
//         Account: '$AccountId',
//         CallType: 1,
//         CallStatus: 1,
//         Numbers: 1,
//         Tags: 1,
//         Caller: 1,
//         ForwardTo: 1,
//         StartTime: 1,
//         Duration: 1,
//         Notes: 1,
//         User: null,
//         CallInitiatedAt: '$PC_intiated',
//         CallAt: '$PC_in_progress',
//         CallRouteRingingAt: '$CC_ringing',
//         CallRouteConnectedAt: '$CC_in_progress',
//         CallRouteCompletedAt: '$CC_completed',
//         _id: 0,
//         Type: {
//             $literal: 'LineForward'
//         }
//     }
// };

// public methods
export async function getInbox(request: InboxRequest, accountId: string) {
    if (!request.source || request.source.length <= 0) {
        return [];
    }
    const pipelines: any[] = [];

    pipelines.push(lineForwardFilter(request, accountId));
    pipelines.push(lineForwardProjection);

    const query = LineForwardModel.aggregate([
        lineForwardFilter(request, accountId),
        lineForwardProjection,
        {
          $skip: (request.page - 1) * request.pageSize,
        },
        {
            $limit: request.pageSize
        },
        {
            $sort: { subscribeDate: -1}
        }
    ]);

    const count = await LineForwardModel.aggregate(pipelines).count("total");
    const data = await query.exec();

    return {
        data,
        count: count[0].total,
    }
}



// private methods
function lineForwardFilter(request: InboxRequest, accountId: string) {
    const filter: any = {};
    const hasLineForward = request.source.some(source => source === 'LineForward');
    if (hasLineForward) {
        filter.AccountId = accountId;
    } else {
        filter.AccountId = false;
    }

    if (request.numbers) {
        filter.Numbers = request.numbers;
    }

    if (request.callTypes) {
        filter.CallType = { $in: request.callTypes }
    }
    return { $match: filter };
}