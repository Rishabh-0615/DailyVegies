import jwt from 'jsonwebtoken';

const generateAdminToken=(res)=>{
    
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SEC, { expiresIn : "15d" });

    res.cookie("token",token,{
        maxAge : 15*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
    });
};

export default generateAdminToken;