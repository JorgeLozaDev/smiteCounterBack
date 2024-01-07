import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  deleteCounterGod,
  deleteListCounter,
  getAdminMainList,
  getAllCreatedListsCounters,
  getListById,
  getProfile,
  loginUser,
  saveListCounter,
  singIn,
  updateProfile,
} from "./controller";

const router = express.Router();

router.post("/addUser", singIn);
router.post("/login", loginUser);
router.post("/saveListCounter", authMiddleware, saveListCounter);
router.get("/getListCounter", authMiddleware, getAllCreatedListsCounters);
router.get("/profile", authMiddleware, getProfile);
router.get("/counters", getAdminMainList);
router.put("/updateProfile", authMiddleware, updateProfile);
router.delete("/deleteCounterGod/", authMiddleware, deleteCounterGod);

router.get("/getList/:id", authMiddleware, getListById);
router.delete("/deleteListCounter/:id", authMiddleware, deleteListCounter);

export default router;
