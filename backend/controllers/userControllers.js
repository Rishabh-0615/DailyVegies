import TryCatch from "../utils/TryCatch.js";
import { User } from "../models/userModel.js";
import generateToken from "../middlewares/generateToken.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import validator from 'validator';
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";

 // Temporary storage for unverified users
 const TEMP_USERS = {}; // Use Redis or a database for better scalability



 
export const registerWithOtp = TryCatch(async (req, res) => {
    const { name, email, mobile, password, role,location } = req.body;
    if(role==="delivery boy" && !location){
        return res.status(400).json({
            message:"Location is required for delivery boy",
        })

    }
  
    if (!name || !email || !password || !role || !mobile) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
  
    
    if (Array.isArray(email) || !validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    const existingMobile = await User.findOne({mobile});
    if(existingMobile){
        return res.status(400).json({
            message:"mobile number already exists",
        });
    }

  
    const otp = crypto.randomInt(100000, 999999);
    console.log(otp);
    TEMP_USERS[email] = {
      name,
      password,
      mobile,
      role,
      otp,
      location,
      expiresAt: Date.now() + 5 * 60 * 1000, 
    };
  
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASS,
      },
    });
  
    try {
      
      await transporter.sendMail({
        from: process.env.MY_GMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      });
  
     
      const token = jwt.sign({ email }, process.env.JWT_SEC, { expiresIn: "5m" });
  
      res.status(200).json({
        message: "OTP sent successfully. Please verify to complete registration.",
        token,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({
        message: "Failed to send OTP",
        error: error.message,
      });
    }
  });
 
 export const verifyOtpAndRegister = TryCatch(async (req, res) => {
   const { otp } = req.body;
   const { token}=req.params;
 
   if (!otp || !token) {
     return res.status(400).json({ message: "OTP and token are required" });
   }
 
   try {
     const { email } = jwt.verify(token, process.env.JWT_SEC);

     const tempUser = TEMP_USERS[email];
     if (!tempUser) {
       return res.status(400).json({ message: "No OTP request found for this email" });
     }
 
     if (tempUser.expiresAt < Date.now()) {
       delete TEMP_USERS[email];
       return res.status(400).json({ message: "OTP expired" });
     }
 
     if (parseInt(tempUser.otp) !== parseInt(otp)) {
       return res.status(400).json({ message: "Invalid OTP" });
     }
 
    
     const hashPassword = await bcrypt.hash(tempUser.password, 10);
     const user = await User.create({
       name: tempUser.name,
       mobile: tempUser.mobile,
       role: tempUser.role,
       email,
       password: hashPassword,
       location: tempUser.location,
     });
 
     delete TEMP_USERS[email]; 

     if (user.role === "farmer") {
      return res.status(201).json({
        user,
        message: "Farmer registered successfully. Admin approval required before login.",
      });
    }
     if (user.role === "delivery boy") {
      return res.status(201).json({
        user,
        message: "Delivery Boy registered successfully. Admin approval required before login.",
      });
    }

     generateToken(user, res);
 
     res.status(201).json({
       user,
       message: "User registered successfully",
     });
   } catch (error) {
     console.error("Token verification failed:", error);
     return res.status(400).json({ message: "Invalid or expired token" });
   }
 });
 


 
export const loginUser=TryCatch(async(req,res)=>{
    const{email,password,role }=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"Email or Password Incorrect.",
        });
    }
    const comaparePassword=await bcrypt.compare(password,user.password);


    if(!comaparePassword){
        return res.status(400).json({
            message:"Email or Password Incorrect.",
        });

    }
    if(user.role!=role){
        return res.status(400).json({
            message:"Role Incorrect.",
        });
    }
    if (user.role === "farmer" && !user.isVerifiedByAdmin) {
      return res.status(403).json({ message: "Account not verified by admin" });
    }
    if (user.role === "delivery boy" && !user.isVerifiedByAdmin) {
      return res.status(403).json({ message: "Account not verified by admin" });
    }
    generateToken(user,res);


    res.json({
        user,
        message:"Logged In",

    })

});
 
 
export const forgetPassword=TryCatch(async(req,res)=>{
    const {email} =req.body;

     
  if (Array.isArray(email) || !validator.isEmail(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }
    const user= await User.findOne({email})
    if(!user)
        return res.status(400).json({
            message:"No user found",
    })

    const otp = crypto.randomInt(100000, 999999);
    TEMP_USERS[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, 
    };
    
    const transporter = nodemailer.createTransport({
        service:"gmail",
        secure:true,
        auth:{
            user:process.env.MY_GMAIL,
            pass:process.env.MY_PASS,
        }
    })
    console.log(otp);
    
    try {
      
      await transporter.sendMail({
        from: process.env.MY_GMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      });
  
     
      const token = jwt.sign({ email }, process.env.JWT_SEC, { expiresIn: "5m" });
  
      res.status(200).json({
        message: "OTP sent successfully.",
        token,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({
        message: "Failed to send OTP",
        error: error.message,
      });
    }
})

export const resetPassword = TryCatch(async (req, res) => {
  const { token } = req.params;
  const { otp, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (!otp || !token) {
    return res.status(400).json({ message: "OTP and token are required" });
  }

  let email;
  try {
    ({ email } = jwt.verify(token, process.env.JWT_SEC));
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const tempUser = TEMP_USERS[email];
  if (!tempUser) {
    console.log("TEMP_USERS:", TEMP_USERS);
    return res.status(400).json({ message: "No OTP request found for this email" });
  }

  console.log("Stored OTP:", tempUser.otp);
  console.log("Provided OTP:", otp);

  if (tempUser.expiresAt < Date.now()) {
    console.log("OTP expired. ExpiresAt:", tempUser.expiresAt, "Current time:", Date.now());
    delete TEMP_USERS[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (tempUser.otp.toString() !== otp.toString()) {
    console.log("Invalid OTP. Stored:", tempUser.otp, "Provided:", otp);
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  delete TEMP_USERS[email];
  res.json({ message: "Password reset successful" });
});



export const myProfile=TryCatch(async(req,res)=>{
    const user=await User.findById(req.user._id)
    res.json(user);
})


export const updateProfile = async (req, res) => {
  try {
    const { name, mobile, location } = req.body;

    // Input Validation
    if (name && typeof name !== "string") {
      return res.status(400).json({ message: "Invalid name format" });
    }
    if (mobile && !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }
    if (location && typeof location !== "string") {
      return res.status(400).json({ message: "Invalid location format" });
    }

    const user = await User.findOne({mobile});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    user.name = name || user.name;
    user.mobile = mobile || user.mobile;
    if (location !== undefined && location !== null) {
      user.location = location;
    }

    await user.save();

    const { password, ...updatedUser } = user.toObject(); // Exclude sensitive fields
    res.json({ message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};




export const userProfile= TryCatch(async(req,res)=>{
    const user= await User.findById(req.params.id).select("-password");
    res.json(user);

})

export const logoutUser = TryCatch(async(req,res)=>{
    res.clearCookie("token");
    res.json({
        message:"User Logged out",
    })
})


