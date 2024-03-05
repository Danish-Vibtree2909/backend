import {Document}  from 'mongoose';

export default interface TelegramRecordFormatted extends Document{
    token? : string;
    update_id ? : number;
    Direction?: string;
    From?: string;
    To? : string;
    WaSid? : string; //Message ID message.message_id
    message: { // in outbound message is "result" but in inbound it is "message"
      message_id: any,
      from: {
        id: any,
        is_bot: boolean,
        first_name: string,
        last_name?:  string,
        language_code: string
      },
      chat: { id: any, first_name: string, type: string },
      date: any,
      text: string,
      entities : any,
      messageBody? : string
    }
}

//inbound
// {
//     update_id: 748488114,
//     message: {
//       message_id: 12,
//       from: {
//         id: 5060805390,
//         is_bot: false,
//         first_name: 'Danish',
//         language_code: 'en'
//       },
//       chat: { id: 5060805390, first_name: 'Danish', type: 'private' },
//       date: 1666682607,
//       text: 'Hello'
//     }
//   }

// //outbound 
// {
//     "status": true,
//     "data": {
//         "ok": true,
//         "result": {
//             "message_id": 14,
//             "from": {
//                 "id": 5549169131,
//                 "is_bot": true,
//                 "first_name": "test_bot",
//                 "username": "danish2909_bot"
//             },
//             "chat": {
//                 "id": 5060805390,
//                 "first_name": "Danish",
//                 "type": "private"
//             },
//             "date": 1666682697,
//             "text": "Hello From server side"
//         }
//     }
// }