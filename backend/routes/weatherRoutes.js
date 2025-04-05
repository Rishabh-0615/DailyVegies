
import express from 'express'
const router = express.Router();


import { getForecast } from "../controllers/weatherController.js";

router.get("/forecast", getForecast);

export default router;