import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config()
import createServer from "./createServer";
import { setupCollectionWatch } from "./socket/socketService";
import { setupSocketListner } from "./socket/socketSetup";
import GlobalCdr from "./types/globalCdr";
import GlobalObject from "./types/globalObject";
// import {checkNUmbersFromVibconnectAndSave} from './services/CheckNumber';

const app = createServer();
const server = require("http").createServer(app);

const io = setupSocketListner(server);
app.set("socketio", io);

const PORT: string | number = process.env.PORT || 8080;
const uri: string  = process.env.MONGO_DB_URL!;

let globalcdr: GlobalCdr;
let globalObject: GlobalObject;

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
mongoose
  .connect(uri)
  .then((client) => {
    setupCollectionWatch(client, io);
    server.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.log(
      ` :::: STOP :::: Server is not running on http://localhost:${PORT}`,
      " ::: CAUSE ::: ",
      error.message
    );
    // throw error
  });