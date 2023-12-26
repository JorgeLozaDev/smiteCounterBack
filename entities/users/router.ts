import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { getProfile, loginUser, singIn, updateProfile } from "./controller";

const router = express.Router();

router.post("/addUser", singIn); 
router.post("/login", loginUser);
router.get("/profile",authMiddleware, getProfile);
router.put("/updateProfile", authMiddleware, updateProfile);

export default router;
