import TryCatch from "../utils/TryCatch.js";
import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";

import axios from "axios";
import { OrderDetails } from "../models/orderDetailsModel.js";


const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;

/**
 * Add or remove items from the cart
 */
export const addCart = TryCatch(async (req, res) => {
  const { productId, quantity, price, remove } = req.body;

  if (!productId) return res.status(400).json({ error: "Product ID is required" });
  if (!quantity || quantity <= 0) return res.status(400).json({ error: "Invalid quantity" });
  if (price !== undefined && price < 0) return res.status(400).json({ error: "Invalid price" });

  console.log("Incoming request data:", req.body);

  let cart = await Cart.findOne({ consumer: req.user._id });

  if (!cart) cart = new Cart({ consumer: req.user._id, items: [] });

  if (remove) {
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    return res.status(200).json({ message: "Item removed from cart", cart });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  if (product.quantity < quantity) return res.status(400).json({ error: "Insufficient stock available" });

  const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);

  if (productIndex >= 0) {
    await Cart.findOneAndUpdate(
      { consumer: req.user._id, "items.productId": productId },
      { $set: { "items.$.quantity": quantity, "items.$.price": price || cart.items[productIndex].price } }
    );
  } else {
    cart.items.push({ productId, quantity, price });
    await cart.save();
  }

  res.status(200).json({ message: "Cart updated successfully", cart });
});






export const getCart = TryCatch(async (req, res) => {
  let cart = await Cart.findOne({ consumer: req.user._id }).populate("items.productId");
  if (!cart) {
    // Return an empty cart structure
    cart = { items: [], totalPrice: 0 };
  } else {
    cart.calculateTotalPrice(); // Ensure total price is always updated
    await cart.save();
  }
  res.status(200).json(cart);
});




export const clearCart = TryCatch(async (req, res) => {
  // Ensure the user is authenticated and the user object exists
  if (!req.user || !req.user._id) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  const user = req.user._id;  // Corrected user access
  console.log('Authenticated User ID:', user);

  // Find the cart using the consumer's user ID
  const cart = await Cart.findOne({ consumer: user });

  if (!cart) {
    return res.status(404).json({ error: "No cart found to clear" });
  }

  // Clear the cart items and reset other fields
  cart.items = [];
  cart.totalPrice = 0;
  cart.deliveryFee = 0;
  cart.finalPrice = 0;

  try {
    // Save the cleared cart
    await cart.save();
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error('Error clearing cart:', err);
    return res.status(500).json({ error: "Failed to clear the cart. Please try again." });
  }
});




export const searchProducts = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });
    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to search products" });
  }
};


export const mockApi=TryCatch(async(req,res)=>{
  const { amount, currency } = req.body;

  console.log(`Received payment request for ${amount} ${currency}`);

  // Simulate payment success/failure after 2 seconds
  setTimeout(() => {
    const isSuccess = Math.random() > 0.2; // 80% success rate

    if (isSuccess) {
      res.json({
        payment_status: "success",
        payment_id: `TEST_${Date.now()}`,
        amount,
        currency,
      });
    } else {
      res.status(500).json({
        payment_status: "failure",
        message: "Mock payment failed. Try again later.",
      });
    }
  }, 2000);
})



const getLocationCoordinates = async (address) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: process.env.GEOCODING_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } else {
      throw new Error('Unable to geocode address');
    }
  } catch (error) {
    throw new Error('Failed to retrieve location data');
  }
};


const HUB_LOCATION = {
  latitude: 18.45778632874901, // Example latitude of your hub
  longitude: 73.85077995089597 // Example longitude of your hub
};

// Function to calculate distance using Google Maps Distance Matrix API
const calculateDistance = async (origin) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: `${origin.latitude},${origin.longitude}`,
        destinations: `${HUB_LOCATION.latitude},${HUB_LOCATION.longitude}`,
        key: process.env.GEOCODING_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const distance = response.data.rows[0].elements[0].distance.value; // Distance in meters
      const duration = response.data.rows[0].elements[0].duration.text; // Duration text
      return {
        distanceInMeters: distance,
        distanceInKm: distance / 1000, // Convert meters to kilometers
        duration: duration
      };
    } else {
      throw new Error('Unable to calculate distance');
    }
  } catch (error) {
    throw new Error('Error calculating distance');
  }
};

// Function to calculate delivery fee based on distance (e.g., ₹10 per km)
const calculateDeliveryFee = (distanceInKm) => {
  const feePerKm = 2; // ₹10 per kilometer, you can adjust this
  return distanceInKm * feePerKm;
};

// Controller to get all orders for a specific user




// In user controller
export const updateLocation = async (req, res) => {
  try {
    const { location } = req.body;
    const userId = req.user._id;

    // Validate location
    if (!location || location.trim().length < 3) {
      return res.status(400).json({ error: 'Invalid location' });
    }

    // Update user's location
    await User.findByIdAndUpdate(userId, { 
      deliveryLocation: location 
    }, { new: true });

    return res.status(200).json({ 
      message: 'Location updated successfully',
      location 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update location' });
  }
};

export const getUserLocation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ 
      location: user.deliveryLocation || '' 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch location' });
  }
};


import moment from 'moment';

export const saveOrder = async (req, res) => {
  try {
    const { cartItems, totalPrice: subTotal, locationAddress } = req.body;
    const userId = req.user._id;

    if (!userId || !cartItems || !subTotal || !locationAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get the coordinates of the user's location using geocoding
    const { latitude, longitude } = await getLocationCoordinates(locationAddress);

    // Calculate the distance between the user's location and the hub
    const distanceData = await calculateDistance({ latitude, longitude });
    const { distanceInKm } = distanceData;

    // Calculate the delivery fee based on the distance
    const deliveryFee = calculateDeliveryFee(distanceInKm);

    // Update the total price by adding the delivery fee
    const updatedTotalPrice = subTotal + deliveryFee;

    // **Reduce stock for each ordered product & remove if quantity reaches 0**
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }

      product.quantity -= item.quantity; // Reduce stock

      if (product.quantity === 0) {
        await Product.findByIdAndDelete(item.productId); // Remove product from DB
      } else {
        await product.save(); // Update product stock
      }
    }

    // **Create and save the order**
    const orderDetails = new OrderDetails({
      userId,
      cartItems,
      deliveryFee,
      subTotal,
      totalPrice: updatedTotalPrice,
      location: {
        address: locationAddress,
        coordinates: [longitude, latitude],
      },
      paymentStatus: "PENDING",
    });

    await orderDetails.save();

    // **Clear the cart after order is placed**
    await Cart.findOneAndUpdate(
      { consumer: userId },
      { items: [], totalPrice: 0 },
      { new: true }
    );

    return res.status(201).json({
      message: "Order saved successfully",
      order: orderDetails,
      deliveryFee,
      subTotal,
      updatedTotalPrice,
      distance: distanceData.distanceInKm,
      duration: distanceData.duration,
    });
  } catch (error) {
    console.error("Error in saveOrder:", error);
    return res.status(500).json({ error: "Failed to save order" });
  }
};




export const getDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Fetch the latest order for the user
    const latestOrder = await OrderDetails.findOne({ userId })
      .populate('cartItems.productId', 'name price image')
      .sort({ createdAt: -1 });

    if (!latestOrder) {
      return res.status(404).json({ error: 'No orders found' });
    }

    return res.status(200).json({
      message: 'Latest order retrieved successfully',
      order: latestOrder
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch the latest order' });
  }
};

// New controller for updating payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, paymentMethod } = req.body;
    const userId = req.user._id;

    // Find the order based on orderId and userId
    const order = await OrderDetails.findOne({ _id: orderId, userId }).populate('cartItems.productId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the payment status
    order.paymentStatus = paymentStatus;
    order.paymentMethod = paymentMethod;
    order.paymentUpdatedAt = new Date();
    
    // If payment is successful, update product stock
    if (paymentStatus === "SUCCESS") {
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.quantity -= item.quantity;
          await product.save();
        }
      }
    }

    await order.save();

    return res.status(200).json({
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update payment status' });
  }
};


export const getDetailsAll = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Fetch all orders for the user, sorted by creation date
    const allOrders = await OrderDetails.find({ userId })
      .populate('cartItems.productId', 'name price image ')
      .sort({ createdAt: -1 });

    if (!allOrders || allOrders.length === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }

    return res.status(200).json({
      message: 'Orders retrieved successfully',
      orders: allOrders
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


export const deleteExpiredProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany({ expiryDate: { $lt: new Date() } });
    res.status(200).json({ message: `Deleted ${result.deletedCount} expired products.` });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expired products.", error });
  }
};
