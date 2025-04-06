import express from 'express';
import { getNdviImage } from '../controllers/satelliteController.js';

const router = express.Router();

// POST /api/satellite/ndvi
router.post('/ndvi', getNdviImage);

export default router;
