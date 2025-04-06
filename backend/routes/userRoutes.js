import express from 'express';
import { forgetPassword, loginUser, logoutUser, myProfile, registerWithOtp, resetPassword, updateProfile, userProfile, verifyOtpAndRegister,generateDeliveryOtp,verifyDeliveryOtp } from '../controllers/userControllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const router=express.Router();

router.post("/register", registerWithOtp);
router.post("/login", loginUser);
router.post("/verifyOtp/:token",verifyOtpAndRegister);
router.post("/forget",forgetPassword);
router.post("/reset-password/:token",resetPassword);
router.get("/logout",isAuth,logoutUser);
router.get("/me",isAuth,myProfile);
router.get("/:id",isAuth,userProfile);
router.put("/updateProfile",isAuth,updateProfile)
router.post('/delivery/send-otp', isAuth, generateDeliveryOtp);
router.post('/delivery/confirm', isAuth, verifyDeliveryOtp);





export default router;