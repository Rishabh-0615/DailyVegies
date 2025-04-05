import  express from 'express'
const router = express.Router();
import { addCrop, getMyCrops } from "../controllers/cropController.js";
router.post("/add", addCrop);
router.get("/my-crops", getMyCrops);

export default router;
