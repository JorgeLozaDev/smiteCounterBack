"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post("/addGod", controller_1.addGod);
router.post("/filterGodsActive", controller_1.filterAllActiveGods);
router.post("/createGod", authMiddleware_1.authMiddleware, controller_1.createGod);
router.get("/allGodsActive", controller_1.getAllActiveGods);
router.get("/allGods", authMiddleware_1.authMiddleware, controller_1.getAllGods);
router.get("/godDetails/:id", controller_1.getGodDetails);
router.put("/updateGodActive/:id", authMiddleware_1.authMiddleware, controller_1.updateGodActive);
router.put("/updateGod/:id", authMiddleware_1.authMiddleware, controller_1.updateGod);
module.exports = router;
//# sourceMappingURL=router.js.map