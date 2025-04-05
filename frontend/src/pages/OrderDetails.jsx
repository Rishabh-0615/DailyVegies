

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png'
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Wallet,
  Smartphone,
  ArrowRight,
  Loader2,
  Shield,
  X,
  Info,
  Truck
} from 'lucide-react';

const PaymentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

const DeliveryStatus = {
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [responseId, setResponseId] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/customer/order');
      setOrder(response.data.order);
      console.log('Order details:', response.data.order);
      setError(null);
    } catch (err) {
      console.error('Order fetch error:', err);
      setError(err.response?.data?.error || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  // Fetch payment details when responseId changes
  useEffect(() => {
    if (responseId) {
      fetchPaymentDetails(responseId);
    }
  }, [responseId]);

  const fetchPaymentDetails = async (paymentId) => {
  try {
    // Make sure to verify the payment with your server
    const response = await axios.get(`http://localhost:5000/payment/${paymentId}`);
    console.log('Payment details:', response.data);
    setPaymentDetails(response.data);
    
    // Update order payment status
    if (response.data.status === 'captured' || response.data.status === 'authorized') {
      // Verify the payment with the server first
      try {
        // This is the missing step - we need to verify the payment with the backend
        await axios.post("http://localhost:5000/payment/verify", {
          razorpay_order_id: window.razorpayOrderId, // Store this globally or in state
          razorpay_payment_id: paymentId,
          razorpay_signature: window.razorpaySignature, // Store this from handler
          orderId: order._id
        });
        
        // Now update the order in your application database
        await axios.patch(`/api/user/customer/payment/status/${order._id}`, {
          paymentStatus: PaymentStatus.COMPLETED,
          paymentMethod: 'razorpay',
          paymentId: paymentId
        });
        
        console.log('Payment verified and status updated to COMPLETED');
        
        setShowPaymentModal(false);
        setProcessingPayment(false);
        await fetchOrderDetails();
      } catch (verifyError) {
        console.error('Payment verification error:', verifyError);
        setPaymentError('Failed to verify payment with server. Please contact support.');
        setProcessingPayment(false);
      }
    } else {
      setPaymentError(`Payment not completed. Status: ${response.data.status}`);
      setProcessingPayment(false);
    }
  } catch (err) {
    console.error('Payment details fetch error:', err);
    //setPaymentError('Failed to fetch payment details. Please contact support.');
    setProcessingPayment(true);
  }
  finally{
    setProcessingPayment(true);
    await axios.patch(`/api/user/customer/payment/status/${order._id}`, {
      paymentStatus: PaymentStatus.COMPLETED,
      paymentMethod
    });
  }
};

  // Razorpay integration
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount) => {
    try {
      console.log('Creating Razorpay order for amount:', amount);
      
      const data = JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paisa and ensure it's an integer
        currency: "INR"
      });
      
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:5000/orders",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };
      
      const response = await axios.request(config);
      console.log('Razorpay order created:', response.data);
      
      // Map the response to match what your code expects
      return {
        id: response.data.order_id,
        amount: response.data.amount,
        currency: response.data.currency
      };
    } catch (err) {
      console.error('Error creating Razorpay order:', err);
      throw new Error('Failed to create order: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    }
  };

  const handleRazorpayScreen = async (amount) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  
    if (!res) {
      setPaymentError("Failed to load Razorpay. Please check your connection.");
      setProcessingPayment(false);
      return;
    }
  
    try {
      // First create the order
      const orderData = await createRazorpayOrder(order.totalPrice);
      
      // Store order ID globally for verification
      window.razorpayOrderId = orderData.id;
      
      const options = {
        key: "rzp_test_5GCQM2qPC6xhmN", // Make sure this matches your key_id from backend
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        order_id: orderData.id, // Use the order_id from response
        name: "Farm To Table",
        image: {logo},
        handler: function (response) {
          console.log('Razorpay payment successful:', response);
          // Store signature globally for verification
          window.razorpaySignature = response.razorpay_signature;
          setResponseId(response.razorpay_payment_id);
        },
        prefill: {
          name: order?.customer?.name || "",
          email: order?.customer?.email || "",
          contact: order?.customer?.phone || ""
        },
        theme: {
          color: "#4CAF50"
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay modal dismissed');
            setProcessingPayment(false);
          }
        }
      };
  
      console.log('Initializing Razorpay with options:', options);
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response.error);
        setPaymentError(response.error.description);
        setProcessingPayment(false);
      });
      
      paymentObject.open();
    } catch (err) {
      console.error('Razorpay initialization error:', err);
      setPaymentError('Failed to initialize payment: ' + (err.message || 'Unknown error'));
      setProcessingPayment(false);
    }
  };

  const simulatePayment = async () => {
    if (!order || !paymentMethod) {
      setPaymentError('Please select a payment method');
      return;
    }

    try {
      setProcessingPayment(true);
      setPaymentError(null);
      
      // For Razorpay, we handle differently
      if (paymentMethod === 'razorpay') {
        try {
          console.log('Starting Razorpay payment process');
          
          // Update order status to processing
          await axios.patch(`/api/user/customer/payment/status/${order._id}`, {
            paymentStatus: PaymentStatus.PROCESSING,
            paymentMethod
          });
          
          // Initialize Razorpay
          await handleRazorpayScreen(order.totalPrice);
        } catch (err) {
          console.error('Razorpay payment error:', err);
          setPaymentError('Failed to initialize Razorpay: ' + (err.message || 'Unknown error'));
          setProcessingPayment(false);
        }
        return;
      }
      
      // For other payment methods
      await axios.patch(`/api/user/customer/payment/status/${order._id}`, {
        paymentStatus: PaymentStatus.PROCESSING,
        paymentMethod
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() < 0.9;
      
      const finalStatus = success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
      await axios.patch(`/api/user/customer/payment/status/${order._id}`, {
        paymentStatus: finalStatus,
        paymentMethod
      });

      if (success) {
        setShowPaymentModal(false);
        await fetchOrderDetails();
      } else {
        setPaymentError('Payment was declined. Please try again or use a different payment method.');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setPaymentError(
        err.response?.data?.error || 
        'Payment processing failed. Please check your connection and try again.'
      );
    } finally {
      if (paymentMethod !== 'razorpay') {
        setProcessingPayment(false);
      }
    }
  };

  const PaymentStatusBadge = () => {
    const statusConfig = {
      [PaymentStatus.PENDING]: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-4 h-4 mr-2" />
      },
      [PaymentStatus.PROCESSING]: {
        color: 'bg-blue-100 text-blue-800',
        icon: <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      },
      [PaymentStatus.COMPLETED]: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4 mr-2" />
      },
      [PaymentStatus.FAILED]: {
        color: 'bg-red-100 text-red-800',
        icon: <AlertCircle className="w-4 h-4 mr-2" />
      }
    };

    if (!order || !order.paymentStatus) {
      return null;
    }

    return (
      <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        statusConfig[order.paymentStatus]?.color || 'bg-gray-100 text-gray-800'
      }`}>
        {statusConfig[order.paymentStatus]?.icon || <Info className="w-4 h-4 mr-2" />}
        {order.paymentStatus}
      </span>
    );
  };

  const DeliveryStatusBadge = () => {
    const statusConfig = {
      [DeliveryStatus.PROCESSING]: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Package className="w-4 h-4 mr-2" />
      },
      [DeliveryStatus.SHIPPED]: {
        color: 'bg-blue-100 text-blue-800',
        icon: <Truck className="w-4 h-4 mr-2" />
      },
      [DeliveryStatus.OUT_FOR_DELIVERY]: {
        color: 'bg-orange-100 text-orange-800',
        icon: <Truck className="w-4 h-4 mr-2 animate-bounce" />
      },
      [DeliveryStatus.DELIVERED]: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4 mr-2" />
      },
      [DeliveryStatus.CANCELLED]: {
        color: 'bg-red-100 text-red-800',
        icon: <AlertCircle className="w-4 h-4 mr-2" />
      }
    };

    if (!order || !order.deliveryStatus) {
      return null;
    }

    return (
      <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        statusConfig[order.deliveryStatus]?.color || 'bg-gray-100 text-gray-800'
      }`}>
        {statusConfig[order.deliveryStatus]?.icon || <Info className="w-4 h-4 mr-2" />}
        {order.deliveryStatus.replace('_', ' ')}
      </span>
    );
  };

  const PaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Complete Payment</h2>
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setPaymentError(null);
                setPaymentMethod(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount to Pay</span>
              <span className="text-xl font-bold">₹{order?.totalPrice || 0}</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-medium">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border ${
                  paymentMethod === 'card' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <CreditCard className={`w-6 h-6 mb-2 mx-auto ${
                  paymentMethod === 'card' ? 'text-blue-500' : 'text-gray-500'
                }`} />
                <div className="text-sm font-medium text-center">Card</div>
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-lg border ${
                  paymentMethod === 'upi' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <Smartphone className={`w-6 h-6 mb-2 mx-auto ${
                  paymentMethod === 'upi' ? 'text-blue-500' : 'text-gray-500'
                }`} />
                <div className="text-sm font-medium text-center">UPI</div>
              </button>
              <button
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 rounded-lg border ${
                  paymentMethod === 'razorpay' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <Wallet className={`w-6 h-6 mb-2 mx-auto ${
                  paymentMethod === 'razorpay' ? 'text-blue-500' : 'text-gray-500'
                }`} />
                <div className="text-sm font-medium text-center">Razorpay</div>
              </button>
            </div>
          </div>

          {/* {paymentError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {paymentError}
            </div>
          )} */}

          {responseId && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
              <p className="font-medium">Payment ID: {responseId}</p>
              {paymentDetails && (
                <div className="mt-2 text-sm">
                </div>
              )}
            </div>
          )}

          <button
            onClick={simulatePayment}
            disabled={!paymentMethod || processingPayment}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium ${
              !paymentMethod || processingPayment
                ? 'bg-gray-100 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {processingPayment ? (
              <>
              
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
               
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Pay Securely
              </>
            )}
          </button>

          <div className="mt-4 text-sm text-gray-500 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            This is a simulated payment for demonstration
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-6">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p>No recent orders found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Package className="mr-3 text-blue-500" />
            Order Details
          </h1>
          <div className="flex items-center space-x-2">
            <PaymentStatusBadge />
            <DeliveryStatusBadge />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="font-semibold flex items-center">
              <MapPin className="mr-2 text-red-500" /> 
              Delivery Location
            </h2>
            <p>{order.location?.address || "Address not available"}</p>
          </div>
          <div>
            <h2 className="font-semibold flex items-center">
              <Clock className="mr-2 text-yellow-500" /> 
              Order Date
            </h2>
            <p>{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-4 flex items-center">
            <Wallet className="mr-2 text-blue-500" /> 
            Order Breakdown
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Order Fee</span>
              <span>₹{order.subTotal || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee || 0}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{order.totalPrice || 0}</span>
            </div>
          </div>
        </div>

         {/* <div>
          <h2 className="font-semibold mb-4">Order Items</h2>
          {order.cartItems && order.cartItems.length > 0 ? (
            order.cartItems.map((item) => (
              <div 
                key={item.productId?._id || item._id || Math.random().toString()} 
                className="flex items-center border-b py-3 last:border-b-0"
              >
                {item.productId?.image?.url && (
                  <img 
                    src={item.productId.image.url} 
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="font-medium">{item.productId?.name || "Product unavailable"}</h3>
                  <p className="text-gray-600">
                    ₹{item.productId?.price || 0} × {item.quantity || 0}
                  </p>
                </div>
                <div className="font-semibold">
                  ₹{(item.productId?.price || 0) * (item.quantity || 0)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items found in this order</p>
          )}
        </div> */}

        {order.paymentStatus === PaymentStatus.PENDING && (
          <div className="mt-6">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center hover:bg-blue-600"
            >
              <CreditCard className="mr-2" />
              Proceed to Payment
              <ArrowRight className="ml-2" />
            </button>
          </div>
        )}

        <PaymentModal />
      </div>
    </div>
  );
};

export default OrderDetails;