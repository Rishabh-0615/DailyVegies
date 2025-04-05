import express from 'express';
import { forgetPassword, loginUser, logoutUser, myProfile, registerWithOtp, resetPassword, updateProfile, userProfile, verifyOtpAndRegister } from '../controllers/userControllers.js';
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


export default router;