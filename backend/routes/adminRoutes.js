import express from 'express';
import { isAuthAdmin } from '../middlewares/isAdminAuth.js';
import {
  getUnverifiedFarmers,
  verifyFarmer,
  adminLogin,
  logoutAdmin,
  getUnverifiedDelivery,
  verifyDelivery,
  meadmin,
  getOrdersByCity,
  getAllBoys,
  assignDeliveryBoy,
  getAssignedDeliveriesByCity,
  getDeliveryStatsByCity,
  updateDeliveryStatus
} from '../controllers/adminControllers.js';

const router = express.Router();

router.post("/admin-login", adminLogin);
router.get("/verify-farmer", getUnverifiedFarmers);
router.get("/meadmin", isAuthAdmin, meadmin);
router.put("/verify-farmer/:userId", verifyFarmer);
router.get("/verify-delivery", getUnverifiedDelivery);
router.put("/verify-delivery/:userId", verifyDelivery);
router.post("/logoutAdmin", isAuthAdmin, logoutAdmin);
router.post("/ordersByCity", isAuthAdmin, getOrdersByCity); // Changed to POST
router.post("/boysByCity", isAuthAdmin, getAllBoys); // Changed to POST
router.put("/assign-delivery", isAuthAdmin, assignDeliveryBoy);
router.post("/assignedDeliveriesByCity",isAuthAdmin,getAssignedDeliveriesByCity)
router.post("/deliveryStatsByCity",isAuthAdmin,getDeliveryStatsByCity)
router.put("/updateDeliveryStatus",isAuthAdmin,updateDeliveryStatus)

export default router;
