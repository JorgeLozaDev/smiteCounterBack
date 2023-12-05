import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/addUser");

export = router;
