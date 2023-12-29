import express, { Request, Response } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  addGod,
  createGod,
  filterAllActiveGods,
  getAllActiveGods,
  getAllGods,
  getGodDetails,
  updateGod,
  updateGodActive,
} from "./controller";
const router = express.Router();

router.post("/addGod", addGod);
router.post("/filterGodsActive", filterAllActiveGods);
router.post("/createGod", authMiddleware, createGod);
router.get("/allGodsActive", getAllActiveGods);
router.get("/allGods", authMiddleware, getAllGods);
router.get("/godDetails/:id", getGodDetails);
router.put("/updateGodActive/:id", authMiddleware, updateGodActive);
router.put("/updateGod/:id", authMiddleware, updateGod);

export = router;
