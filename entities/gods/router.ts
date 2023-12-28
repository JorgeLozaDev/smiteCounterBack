import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { addGod, filterAllActiveGods, getAllActiveGods } from "./controller";
const router = express.Router();

router.post("/addGod", addGod);
router.get("/allGodsActive", getAllActiveGods);
router.post("/filterGodsActive", filterAllActiveGods);

export = router;
