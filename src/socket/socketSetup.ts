import { Server as SocketServer } from 'socket.io';
import {Server} from "http";
import {sendInitialSummary , sendCustomSummary} from "../services/CallStatService/CallStatsService";


export function setupSocketListner(server: Server) {
    const io = new SocketServer(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST'],
        },
        path: '/websockets', // path to make requests to [http://host/websockets]
        maxHttpBufferSize: 1024, // max message payload size (prevents clients from sending gigabytes of data)
        pingInterval:  30 * 1000, // 2 minute
        pingTimeout: 5 * 60 * 1000, // 4 minutes,
        upgradeTimeout: 30000,
        transports : ['websocket', 'polling'],
    });

    io.of("/stats").on('connection', socket => {
        const socketId = socket.id;
        socket.on("ping", () => {
            socket.emit("pong");
          });
        socket.on('join_room', async data => {

            socket.join(`dashboard_${data.auth_id}`);
            console.debug(`joined room -> dashboard_${data.auth_id}`);

            sendInitialSummary(socket, data.auth_id); 
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${socketId}, Reason: ${reason}`)
        });
    });
    io.of("/customStats").on('connection', socket => {
        const socketId = socket.id;
        socket.on("ping", () => {
            socket.emit("pong");
          });
        socket.on('join_room', async data => {
            console.log("Data Receive from frontend : ", data)
            socket.join(`dashboard_${data.auth_id}`);
            console.debug(`joined room -> dashboard_${data.auth_id}`);

            sendCustomSummary(socket, data.auth_id , data.startDate , data.endDate); 
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${socketId}, Reason: ${reason}`)
        });
    });

    io.of("/inbound").on('connection', socket => {
        const socketId = socket.id;
        socket.on("ping", () => {
            socket.emit("pong");
          });
        socket.on('join_room', async data => {
            //here data is the agents number coming from frontend
            console.log(`joined room for inbound number ->` , data);
            socket.join(`inbound_${data}`);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${socketId}, Reason: ${reason}`)
        });
    });

    io.of("/sms").on('connection', socket => {
        const socketId = socket.id;
        socket.on("ping", () => {
            socket.emit("pong");
          });
        socket.on('join_room', async data => {
            
            console.log(`joined room for sms  ->` , data);
            socket.join(`conversations_${data.cloudNumber}`)
            socket.join(`${data.conversationId}`);
            socket.to(`${data.conversationId}`).emit('message', data);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected for viber : ${socketId}, Reason: ${reason}`)
        });
    });

    return io;
}
