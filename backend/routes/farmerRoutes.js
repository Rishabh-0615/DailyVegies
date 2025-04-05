import  express from  'express';
import { isAuth } from '../middlewares/isAuth.js';
import { addProduct, deleteProduct, editProduct, getAllProducts, getFarmerOrders, getSingleProduct } from '../controllers/farmerControllers.js';
import uploadFile from '../middlewares/multer.js';
import axios from 'axios';  
const router = express.Router();


router.post("/addproduct",isAuth,uploadFile,addProduct);
router.get("/all",isAuth,getAllProducts);
router.get("/myproducts",isAuth,getSingleProduct);
router.delete("/delete", isAuth, deleteProduct);
router.put("/edit", isAuth, editProduct);
router.get("/orders", isAuth, getFarmerOrders);


router.post("/predict-price", async (req, res) => {
    try {
      const response = await axios.post("http://localhost:5001/predict", req.body);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Prediction failed: " + error.message });
    }
  });




export default router;