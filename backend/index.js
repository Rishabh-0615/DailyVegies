import  express from 'express';
import dotenv from 'dotenv';
import connectDb from './database/db.js';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import axios from 'axios';
import cors from 'cors';
import Razorpay from 'razorpay';
dotenv.config();
const port=process.env.PORT || 5000;

cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
  });

const app=express();

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json());
app.use(cookieParser());

import userRoutes from './routes/userRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import adminRoutes from './routes/adminRoutes.js'


app.use("/api/user",userRoutes);
app.use("/api/user/farmer",farmerRoutes)
app.use("/api/user/customer",customerRoutes)
app.use("/api/admin", adminRoutes)




const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});




const FLASK_API_URL_PRICE = 'http://localhost:5001/predict-price';
const FLASK_API_URL_DEMAND = 'http://localhost:5001/predict-demand';




const validatePredictionInput = (req, res, next) => {
  const requiredFields = ['Vegetable', 'Temperature', 'Rainfall', 'Seasonal Factor', 'Fuel Price'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  
  const numericFields = ['Temperature', 'Rainfall', 'Seasonal Factor', 'Fuel Price'];
  for (const field of numericFields) {
    const value = parseFloat(req.body[field]);
    if (isNaN(value) || value < 0) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid value for ${field}: must be a non-negative number`
      });
    }
    req.body[field] = value; 
  }

  next();
};


app.post('/api/predict-price', validatePredictionInput, async (req, res) => {
  try {
    const response = await axios.post(FLASK_API_URL_PRICE, req.body);
    return res.json(response.data);
  } catch (error) {
    console.error('Error calling Flask API for price prediction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get price prediction',
      error: error.response?.data || error.message
    });
  }
});


app.post('/api/predict-demand', validatePredictionInput, async (req, res) => {
  try {
    const response = await axios.post(FLASK_API_URL_DEMAND, req.body);
    return res.json(response.data);
  } catch (error) {
    console.error('Error calling Flask API for demand prediction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get demand prediction',
      error: error.response?.data || error.message
    });
  }
});


app.post("/api/predict", async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:5001/predict", {
      text: req.body.text,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error communicating with Flask server" });
  }
});




// Create Razorpay instance once, outside route handlers
 // Make sure this is at the top of your file

// Create Razorpay instance once, outside route handlers
// Store the secrets in environment variables instead of hardcoding
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_5GCQM2qPC6xhmN";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "T27TzLofObgZKJAP0Wt5mMGX";

const razorpay = new Razorpay({ 
  key_id: RAZORPAY_KEY_ID, 
  key_secret: RAZORPAY_KEY_SECRET 
});

// Order creation endpoint
app.post('/orders', async(req, res) => {
  console.log('Received order request:', req.body);
  
  // Validate request body
  if (!req.body.amount) {
    return res.status(400).json({ error: "Amount is required" });
  }
  
  const options = {
    amount: req.body.amount,
    currency: req.body.currency || 'INR',
    receipt: "receipt_" + Date.now(),
    payment_capture: 1
  };
  
  try {
    console.log('Creating Razorpay order with options:', options);
    const response = await razorpay.orders.create(options);
    console.log('Razorpay order created:', response);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Payment verification and status update endpoint
app.post("/payment/verify", async(req, res) => {
  try {
    console.log('Payment verification request:', req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    // Validate required parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    
    // Verify the payment signature
    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');
    
    if (generated_signature === razorpay_signature) {
      try {
        // Payment is successful, now fetch payment details
        console.log('Signature verified, fetching payment details for:', razorpay_payment_id);
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        console.log('Payment details:', payment);
        
        // Verify payment status from Razorpay
        if (payment.status !== 'captured' && payment.status !== 'authorized') {
          return res.status(400).json({ 
            error: "Payment not completed", 
            status: payment.status 
          });
        }
        
        // Call updatePaymentStatus with the necessary information
        try {
          // Make sure orderId is correctly formatted and exists in your database
          // Assuming updatePaymentStatus is imported at the top of the file
          await updatePaymentStatus({
            params: { orderId: orderId },
            body: {
              paymentStatus: "COMPLETED", // Changed from "SUCCESS" to "COMPLETED"
              paymentMethod: payment.method,
              razorpayPaymentId: razorpay_payment_id
            },
            user: req.user // Make sure req.user is available
          }, res);
          
          // Note: If updatePaymentStatus already sends a response, we don't need to send another
          // Otherwise, uncomment the following:
          // res.json({ success: true, message: "Payment verified and status updated" });
        } catch (updateError) {
          console.error('Error updating payment status:', updateError);
          return res.status(500).json({ 
            error: "Payment verified but status update failed", 
            details: updateError.message 
          });
        }
      } catch (paymentFetchError) {
        console.error('Error fetching payment details:', paymentFetchError);
        return res.status(500).json({ 
          error: "Failed to fetch payment details", 
          details: paymentFetchError.message 
        });
      }
    } else {
      // If signature verification fails
      console.error('Signature verification failed');
      console.log('Generated:', generated_signature);
      console.log('Received:', razorpay_signature);
      return res.status(400).json({ error: "Payment verification failed: Invalid signature" });
    }
  } catch(error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: "Failed to verify payment. Please contact support." });
  }
});

// Payment details endpoint
app.get("/payment/:paymentId", async(req, res) => {
  const {paymentId} = req.params;
  try {
    console.log('Fetching payment details for:', paymentId);
    const payment = await razorpay.payments.fetch(paymentId);
    if (!payment){
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json({
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      currency: payment.currency
    });
  } catch(error) {
    console.error('Payment fetch error:', error);
    res.status(500).json({ error: error.message || "Failed to fetch payment details" });
  }
});

// Payment webhook endpoint for Razorpay callbacks
app.post("/razorpay/webhook", async(req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "your_webhook_secret"; // Set this in your Razorpay dashboard
    const razorpaySignature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature
    const generated_signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (generated_signature === razorpaySignature) {
      const event = req.body.event;
      
      if (event === 'payment.authorized' || event === 'payment.captured') {
        const paymentId = req.body.payload.payment.entity.id;
        const razorpayOrderId = req.body.payload.payment.entity.order_id;
        const payment = await razorpay.payments.fetch(paymentId);
        
        // You'll need to fetch the order details from your database
        // based on the Razorpay order ID
        const orderDetails = await OrderDetails.findOne({
          razorpayOrderId: razorpayOrderId
        });
        
        if (orderDetails) {
          // Get signature from payment object if available
          const razorpaySignature = req.body.payload.payment.entity.signature || '';
          
          // Update payment status in database
          await OrderDetails.findByIdAndUpdate(
            orderDetails._id,
            {
              paymentStatus: "COMPLETED",
              paymentMethod: payment.method,
              paymentId: paymentId,
              razorpayPaymentId: paymentId,
              razorpaySignature: razorpaySignature,
              paymentVerified: true
            },
            { new: true }
          );
          
          // Create a mock request with necessary data for updatePaymentStatus if needed
          const mockReq = {
            params: { orderId: orderDetails._id },
            body: {
              paymentStatus: "COMPLETED",
              paymentMethod: payment.method,
              razorpayPaymentId: paymentId,
              razorpaySignature: razorpaySignature
            },
            user: { _id: orderDetails.userId }
          };
          
          const mockRes = {
            status: (code) => ({
              json: (data) => {
                console.log(`Status ${code}:`, data);
              }
            })
          };
          
          // Call the update function
          try {
            await updatePaymentStatus(mockReq, mockRes);
          } catch (updateError) {
            console.error('Error in updatePaymentStatus:', updateError);
            // Continue processing - we'll still return 200 to Razorpay
          }
          
          console.log(`Payment status updated for order: ${orderDetails._id}`);
        } else {
          console.error(`Order not found for razorpayOrderId: ${razorpayOrderId}`);
        }
      } else {
        console.log(`Webhook event ${event} received but not processed`);
      }
      
      // Always return a 200 response to Razorpay webhook
      return res.status(200).json({ received: true });
    } else {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(200).json({ error: "Webhook processing failed" });
    // Still returning 200 to avoid Razorpay retrying failed webhooks
  }
});

// Add a separate verification endpoint for frontend verification
app.post("/payment/verify", async(req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');
    
    if (generatedSignature === razorpay_signature) {
      // Update order in database
      const updatedOrder = await OrderDetails.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "COMPLETED",
          paymentId: razorpay_payment_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpaySignature: razorpay_signature,
          paymentVerified: true
        },
        { new: true }
      );
      
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      return res.status(200).json({ success: true, order: updatedOrder });
    } else {
      return res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: "Payment verification failed" });
  }
});

// Add a payment details endpoint that the frontend can call
app.get("/payment/:paymentId", async(req, res) => {
  try {
    const paymentId = req.params.paymentId;
    
    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    
    return res.status(200).json(payment);
  } catch (error) {
    console.error('Payment details fetch error:', error);
    return res.status(500).json({ error: "Failed to fetch payment details" });
  }
});







app.listen(port , ()=>{
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})


