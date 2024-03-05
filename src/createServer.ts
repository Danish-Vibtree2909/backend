import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import xmlRoutes from "./routes/index";
// import {logRoute} from './middleware/RouteInfo';
import GlobalExceptionHandler from "./middleware/GlobalExceptionHandler";

function createServer() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    const corsOptions = {
      origin: "*",
    };
    app.use(express.json())
    app.use(express.urlencoded({extended: true})); //for form data
    app.use(cors(corsOptions));
    // app.use(logRoute)
    app.use("/api", xmlRoutes);
    app.get("/", (req, res) => {
      return res.status(200).send("app is up!");
    });
    app.use(GlobalExceptionHandler);
    return app;
  }
  
  export default createServer;