"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ROUTER
const router_1 = __importDefault(require("./entities/gods/router"));
const router_2 = __importDefault(require("./entities/users/router"));
app.use((0, cors_1.default)());
app.get("/", (Request, Response) => {
    Response.send("Healcheck: ok");
});
app.use("/gods/", router_1.default);
app.use("/user/", router_2.default);
app.use(errorHandler_1.default);
app.listen(3000, () => console.log("Servidor levantado en 3000"));
//# sourceMappingURL=app.js.map