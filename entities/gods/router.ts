import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  addGod,
  filterAllActiveGods,
  getAllActiveGods,
  getGodDetails,
} from "./controller";
const router = express.Router();

router.post("/addGod", addGod);
router.post("/filterGodsActive", filterAllActiveGods);
router.get("/allGodsActive", getAllActiveGods);
router.get("/godDetails/:id", getGodDetails);

export = router;
