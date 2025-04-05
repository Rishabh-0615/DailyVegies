import TryCatch from "../utils/TryCatch.js";
import { User } from "../models/userModel.js";
import generateAdminToken from "../middlewares/generateAdminToken.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import validator from 'validator';
import { Admin } from "../models/adminModel.js";
import generateToken from "../middlewares/generateToken.js";
import { OrderDetails } from "../models/orderDetailsModel.js";
import { Product } from "../models/productModel.js";
import mongoose from "mongoose";
dotenv.config();




export const defaultAdmin = async () => {
  const existingAdmin = await Admin.findOne({ email: "admin@gmail.com" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin", 10);
    await Admin.create({
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Default admin created");
  }
};

export const  adminLogin = TryCatch(async(req, res) => {
  const { email, password } = req.body;
  console.log(email)

  const user = await Admin.findOne({email})
  if (!user) {
    return res.status(404).json({ message: "Admin not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      
      message: "Incorrect username or password." ,
    

    });
  } 

  generateToken(user,res);
  return res.json({
    user,
    message: "Admin login successful",
  });

});

export const meadmin = TryCatch(async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export const getUnverifiedFarmers = TryCatch(async (req, res) => {
  try {
    const unverifiedFarmers = await User.find({ role: { $regex: /^farmer$/i }, isVerifiedByAdmin: false });

    if (unverifiedFarmers.length === 0) {
      console.log("No unverified farmers found.");
      return res.status(200).json({ farmers: [] });
    }

    console.log("Unverified Farmers:", unverifiedFarmers);
    res.status(200).json({ farmers: unverifiedFarmers });

  } catch (error) {
    console.error("Error fetching unverified farmers:", error);
    res.status(500).json({ message: "Server error fetching unverified farmers" });
  }
});



export const getUnverifiedDelivery = TryCatch(async (req, res) => {
  try {
    const unverifiedDelivery = await User.find({ role: { $regex: /^delivery boy$/i }, isVerifiedByAdmin: false });

    if (unverifiedDelivery.length === 0) {
      console.log("No unverified farmers found.");
      return res.status(200).json({ delivery: [] });
    }

    console.log("Unverified Farmers:", unverifiedDelivery);
    res.status(200).json({ delivery: unverifiedDelivery });

  } catch (error) {
    console.error("Error fetching unverified farmers:", error);
    res.status(500).json({ message: "Server error fetching unverified farmers" });
  }
});



export const verifyFarmer = TryCatch(async (req, res) => {

  try {
    const { userId } = req.params;
    const farmer = await User.findById(userId);

    if (!farmer || farmer.role !== "farmer") {
      return res.status(404).json({ message: "Farmer not found" });
    }

    farmer.isVerifiedByAdmin = true;
    await farmer.save();

    res.status(200).json({ message: "Farmer verified successfully" });
  } catch (error) {
    console.error("Verification error:", error); 
    res.status(500).json({ message: "Server error", error });
  }
});

export const verifyDelivery = TryCatch(async (req, res) => {

  try {
    const { userId } = req.params;
    const delivery = await User.findById(userId);

    if (!delivery || delivery.role !== "delivery boy") {
      return res.status(404).json({ message: "delivery boy not found" });
    }

    delivery.isVerifiedByAdmin = true;
    await delivery.save();

    res.status(200).json({ message: "delivery boy verified successfully" });
  } catch (error) {
    console.error("Verification error:", error); 
    res.status(500).json({ message: "Server error", error });
  }
});



export const logoutAdmin = TryCatch(async(req,res)=>{
  res.clearCookie("token");
  res.json({
      message:"User Logged out",
  })
})


export const getOrdersByCity = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required in the request body.",
      });
    }

    // Step 1: Find all product IDs that belong to the requested city
    const products = await Product.find({ city }).select("_id");

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for the given city.",
      });
    }

    // Extract product IDs
    const productIds = products.map((product) => product._id);

    // Step 2: Find orders that contain at least one product from the given city
    let orders = await OrderDetails.find({
      "cartItems.productId": { $in: productIds }
    })
      .populate("userId", "name email") // Populate user details
      .populate("cartItems.productId", "name price city"); // Populate product details

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for the given city.",
      });
    }

    // Step 3: Filter cart items to include only products from the requested city
    orders = orders.map((order) => {
      const filteredCartItems = order.cartItems.filter((item) =>
        productIds.includes(item.productId._id)
      );

      return {
        ...order._doc, // Spread existing order fields
        cartItems: filteredCartItems, // Replace cart items with filtered ones
      };
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders by city:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllBoys = TryCatch(async (req, res) => {
  try {
    const {city} = req.body;
    const deliveryBoys = await User.find({location:city, role: "delivery boy"});
    if (!deliveryBoys) {
      return res.status(404).json({ message: "No delivery" });
    }
    res.status(200).json(deliveryBoys);
  } catch (error) {
    console.error("Error fetching delivery", error);  
    res.status(500).json({ message: "Server error" });
  }
}
);

const TEMP_USERS = {};

export const assignDeliveryBoy = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;

    if (!orderId || !deliveryBoyId) {
      return res.status(400).json({
        success: false,
        message: "Order ID and Delivery Boy ID are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(deliveryBoyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID or Delivery Boy ID.",
      });
    }

    // Step 1: Fetch the order details
    const order = await OrderDetails.findById(orderId)
      .populate("cartItems.productId", "city")
      .populate("userId", "name email phone address");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (!order.cartItems.length || !order.cartItems[0]?.productId?.city) {
      return res.status(400).json({
        success: false,
        message: "City information is missing in the order.",
      });
    }

    const orderCity = order.cartItems[0].productId.city;

    // Step 2: Check if the delivery boy exists in the same city
    const deliveryBoy = await User.findOne({ _id: deliveryBoyId, role: "delivery boy", location: orderCity });

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "No delivery boy found in the same city.",
      });
    }

    // Step 3: Assign the delivery boy to the order
    order.deliveryBoyId = deliveryBoyId;
    order.deliveryStatus = "OUT_FOR_DELIVERY";
    await order.save();

    // Step 4: Generate OTP and Send Email
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Numeric 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    TEMP_USERS[order.userId.email] = { otp, expiresAt };

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
        to: order.userId.email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Delivery boy assigned successfully. OTP sent for verification.",
      order,
    });

  } catch (error) {
    console.error("Error assigning delivery boy:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const getAssignedDeliveries = TryCatch(async (req, res) => {
  const { deliveryBoyId } = req.params;

  if (!deliveryBoyId) {
    return res.status(400).json({
      success: false,
      message: "Delivery Boy ID is required as a parameter",
    });
  }

  // Verify the delivery boy exists
  const deliveryBoy = await User.findOne({
    _id: deliveryBoyId,
    role: "delivery boy",
  });

  if (!deliveryBoy) {
    return res.status(404).json({
      success: false,
      message: "Delivery personnel not found",
    });
  }

  // Find all orders assigned to this delivery boy
  const assignedOrders = await OrderDetails.find({
    deliveryBoyId,
  })
    .populate("userId", "name email phone address")
    .populate("cartItems.productId", "name price city");

  res.status(200).json({
    success: true,
    count: assignedOrders.length,
    assignedOrders,
  });
});

/**
 * Get all assigned deliveries by city
 */
export const getAssignedDeliveriesByCity = TryCatch(async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({
      success: false,
      message: "City is required in the request body",
    });
  }

  // Find all delivery boys in this city
  const deliveryBoys = await User.find({
    location: city,
    role: "delivery boy",
  }).select("_id name");

  if (deliveryBoys.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No delivery personnel found in this city",
    });
  }

  // Get the IDs of all delivery boys
  const deliveryBoyIds = deliveryBoys.map((boy) => boy._id);

  // Find all orders assigned to any delivery boy in this city
  const assignedOrders = await OrderDetails.find({
    deliveryBoyId: { $in: deliveryBoyIds },
  })
    .populate("userId", "name email phone address")
    .populate("cartItems.productId", "name price city")
    .populate("deliveryBoyId", "name phone location");

  res.status(200).json({
    success: true,
    count: assignedOrders.length,
    assignedOrders,
  });
});

/**
 * Update delivery status
 */
export const updateDeliveryStatus = TryCatch(async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({
      success: false,
      message: "Order ID and status are required",
    });
  }

  // Validate status
  const validStatuses = ["PENDING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELED"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be one of: " + validStatuses.join(", "),
    });
  }

  // Find and update the order
  const order = await OrderDetails.findById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Update the status
  order.deliveryStatus = status;
  
  // If delivered, set delivery completion date
  if (status === "DELIVERED") {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Delivery status updated successfully",
    order,
  });
});

/**
 * Get delivery statistics by city
 */
export const getDeliveryStatsByCity = TryCatch(async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({
      success: false,
      message: "City is required in the request body",
    });
  }

  // Find all delivery personnel in this city
  const deliveryBoys = await User.find({
    location: city,
    role: "delivery boy",
  }).select("_id");

  if (deliveryBoys.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No delivery personnel found in this city",
    });
  }

  const deliveryBoyIds = deliveryBoys.map((boy) => boy._id);

  // Count orders by status
  const pendingCount = await OrderDetails.countDocuments({
    deliveryBoyId: { $in: deliveryBoyIds },
    deliveryStatus: "PENDING",
  });

  const inProgressCount = await OrderDetails.countDocuments({
    deliveryBoyId: { $in: deliveryBoyIds },
    deliveryStatus: "OUT_FOR_DELIVERY",
  });

  const deliveredCount = await OrderDetails.countDocuments({
    deliveryBoyId: { $in: deliveryBoyIds },
    deliveryStatus: "DELIVERED",
  });

  const canceledCount = await OrderDetails.countDocuments({
    deliveryBoyId: { $in: deliveryBoyIds },
    deliveryStatus: "CANCELED",
  });

  // Total orders
  const totalAssigned = pendingCount + inProgressCount + deliveredCount + canceledCount;

  res.status(200).json({
    success: true,
    stats: {
      totalAssigned,
      pending: pendingCount,
      inProgress: inProgressCount,
      delivered: deliveredCount,
      canceled: canceledCount,
      deliveryBoyCount: deliveryBoys.length,
    },
  });
});