"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const createServer_1 = __importDefault(require("./createServer"));
const socketService_1 = require("./socket/socketService");
const socketSetup_1 = require("./socket/socketSetup");
// import {checkNUmbersFromVibconnectAndSave} from './services/CheckNumber';
const app = (0, createServer_1.default)();
const server = require("http").createServer(app);
const io = (0, socketSetup_1.setupSocketListner)(server);
app.set("socketio", io);
const PORT = process.env.PORT || 8080;
const uri = process.env.MONGO_DB_URL;
let globalcdr;
let globalObject;
io.of('/dropcodes').on("connection", function (socket) {
    // const socketId = socket.conn.id;
    // logger.debug(`[node: ${nodeId}] Dropcodes handler starts`, socketId);
    // global.globalObject = {}
    const _id = socket.id;
    console.log("Socket Connected for call : " + _id);
    socket.on("ping", () => {
        // Respond with a pong event
        socket.emit("pong");
    });
    socket.on("join", (room) => {
        socket.join(room);
        io.to(room).emit("roomData", globalObject);
    });
    socket.on("join", (room) => {
        socket.join(room);
        io.to(room).emit("transferCallData", globalObject);
    });
    socket.on("join_transferred_from", (room) => {
        socket.join(room);
        io.to(room).emit("transferredCallStatus", globalObject);
    });
    socket.on("join_incoming", (room) => {
        socket.join(room);
        console.log("global incoming ", globalcdr);
        socket.to(room).emit("roomData_incoming", globalcdr);
    });
    // global.globalcdr = {}
    socket.on("join_cdr", (room) => {
        socket.join(room);
        console.log("global cdr 58 ", globalcdr);
        socket.to(room).emit("account_data", globalcdr);
    });
    // socket.emit('test', "hello from server") // for testing 
    socket.on("disconnect", (reason) => {
        // io.emit('myCustomEvent', {customEvent: 'Custom Message'})
        console.log("Socket disconnected: " + _id + "Reason : " + reason);
    });
});
// checkNUmbersFromVibconnectAndSave(1)
mongoose_1.default
    .connect(uri)
    .then((client) => {
    (0, socketService_1.setupCollectionWatch)(client, io);
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
    .catch((error) => {
    console.log(` :::: STOP :::: Server is not running on http://localhost:${PORT}`, " ::: CAUSE ::: ", error.message);
    // throw error
});
//# sourceMappingURL=app.js.map