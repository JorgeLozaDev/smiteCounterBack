import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { singIn } from "./controller";

const router = express.Router();

router.post("/addUser", singIn);

export = router;
