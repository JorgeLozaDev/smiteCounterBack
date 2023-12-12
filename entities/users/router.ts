import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { loginUser, singIn } from "./controller";

const router = express.Router();

router.post("/addUser", singIn); 
router.post("/login", loginUser);

export default router;
