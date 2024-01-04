import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { getProfile, loginUser, saveListCounter, singIn, updateProfile } from "./controller";

const router = express.Router();
 
router.post("/addUser", singIn); 
router.post("/login", loginUser);
router.post("/saveListCounter", saveListCounter);
router.get("/profile",authMiddleware, getProfile);
router.put("/updateProfile", authMiddleware, updateProfile);

export default router;
