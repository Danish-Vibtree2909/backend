"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketListner = void 0;
const socket_io_1 = require("socket.io");
const CallStatsService_1 = require("../services/CallStatService/CallStatsService");
function setupSocketListner(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST'],
        },
        path: '/websockets',
        maxHttpBufferSize: 1024,
        pingInterval: 30 * 1000,
        pingTimeout: 5 * 60 * 1000,
        upgradeTimeout: 30000,
        transports: ['websocket', 'polling'],
    });
    io.of("/stats").on('connection', socket => {
        const socketId = socket.id;
        socket.on("ping", () => {
            socket.emit("pong");
        });
        socket.on('join_room', async (data) => {
            socket.join(`dashboard_${data.auth_id}`);
            console.debug(`joined room -> dashboard_${data.auth_id}`);
            (0, CallStatsService_1.sendInitialSummary)(socket, data.auth_id);
        });
        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${socketId}, Reason: ${reason}`);
        });
    });
    io.of("/customStats").on('connection', socket => {
        const socketId = socket.id;
        socket.on("ping", () => {
            socket.emit("pong");
        });
        socket.on('join_room', async (data) => {
            console.log("Data Receive from frontend : ", data);
            socket.join(`dashboard_${data.auth_id}`);
            console.debug(`joined room -> dashboard_${data.auth_id}`);
            (0, CallStatsService_1.sendCustomSummary)(socket, data.auth_id, data.startDate, data.endDate);
        });
        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${socketId}, Reason: ${reason}`);
        });
    });
    io.of("/inbound").on('connection', socket => {
        const socketId = socket.id;
        socket.on("ping", () => {
            socket.emit("pong");
        });
        socket.on('join_room', async (data) => {
            //here data is the agents number coming from frontend
            console.log(`joined room for inbound number ->`, data);
            socket.join(`inbound_${data}`);
        });
        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${socketId}, Reason: ${reason}`);
        });
    });
    io.of("/sms").on('connection', socket => {
        const socketId = socket.id;
        socket.on("ping", () => {
            socket.emit("pong");
        });
        socket.on('join_room', async (data) => {
            console.log(`joined room for sms  ->`, data);
            socket.join(`conversations_${data.cloudNumber}`);
            socket.join(`${data.conversationId}`);
            socket.to(`${data.conversationId}`).emit('message', data);
        });
        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected for viber : ${socketId}, Reason: ${reason}`);
        });
    });
    return io;
}
exports.setupSocketListner = setupSocketListner;
//# sourceMappingURL=socketSetup.js.map