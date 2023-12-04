import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { addGod } from "./controller";
const router = express.Router();

router.post("/addGod", addGod);

export = router;
