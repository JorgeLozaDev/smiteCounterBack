"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post("/addUser", controller_1.singIn);
router.post("/login", controller_1.loginUser);
router.post("/saveListCounter", authMiddleware_1.authMiddleware, controller_1.saveListCounter);
router.get("/getListCounter", authMiddleware_1.authMiddleware, controller_1.getAllCreatedListsCounters);
router.get("/getUsers", authMiddleware_1.authMiddleware, controller_1.getAllUsers);
router.get("/profile", authMiddleware_1.authMiddleware, controller_1.getProfile);
router.get("/counters", controller_1.getAdminMainList);
router.put("/updateProfile", authMiddleware_1.authMiddleware, controller_1.updateProfile);
router.delete("/deleteCounterGod/", authMiddleware_1.authMiddleware, controller_1.deleteCounterGod);
router.get("/userDetails/:id", authMiddleware_1.authMiddleware, controller_1.userDetails);
router.put("/updateUserActive/:id", authMiddleware_1.authMiddleware, controller_1.updateUserStatusActive);
router.get("/getList/:id", authMiddleware_1.authMiddleware, controller_1.getListById);
router.delete("/deleteListCounter/:id", authMiddleware_1.authMiddleware, controller_1.deleteListCounter);
exports.default = router;
//# sourceMappingURL=router.js.map