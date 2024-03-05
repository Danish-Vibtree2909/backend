"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./routes/index"));
// import {logRoute} from './middleware/RouteInfo';
const GlobalExceptionHandler_1 = __importDefault(require("./middleware/GlobalExceptionHandler"));
function createServer() {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    app.use(body_parser_1.default.json());
    const corsOptions = {
        origin: "*",
    };
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true })); //for form data
    app.use((0, cors_1.default)(corsOptions));
    // app.use(logRoute)
    app.use("/api", index_1.default);
    app.get("/", (req, res) => {
        return res.status(200).send("app is up!");
    });
    app.use(GlobalExceptionHandler_1.default);
    return app;
}
exports.default = createServer;
//# sourceMappingURL=createServer.js.map