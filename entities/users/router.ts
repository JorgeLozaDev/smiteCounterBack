import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  deleteListCounter,
  getAllCreatedListsCounters,
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
router.put("/updateProfile", authMiddleware, updateProfile);
router.delete("/deleteListCounter/:id", authMiddleware, deleteListCounter);

export default router;
