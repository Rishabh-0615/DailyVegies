import express from 'express';
import { addCrop, getMyCrops } from "../controllers/cropController.js";

const router = express.Router();

router.post("/add", addCrop);
router.get("/my-crops", getMyCrops);

export default router;