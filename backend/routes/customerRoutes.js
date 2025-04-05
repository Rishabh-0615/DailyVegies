import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { addCart, clearCart,  deleteExpiredProducts,  getCart,  getDetails,   getDetailsAll,   getUserLocation, mockApi,    saveOrder, searchProducts, updateLocation, updatePaymentStatus } from '../controllers/customerControllers.js';
const router = express.Router();

router.post("/add", isAuth, addCart);


router.get("/getcart", isAuth, getCart);






router.post("/clear",isAuth,clearCart)
router.get("/search",searchProducts)
router.post("/mock-payment",mockApi)
router.post('/save', isAuth,saveOrder);
router.get('/order', isAuth,getDetails);
router.get('/orders', isAuth,getDetailsAll);

  
  // In routes
  router.post('/update-location', isAuth, updateLocation);
  router.get('/get-location', isAuth, getUserLocation);
  router.patch('/payment/status/:orderId', isAuth,updatePaymentStatus);
  router.delete("/delete",isAuth,deleteExpiredProducts)

  

export default router;