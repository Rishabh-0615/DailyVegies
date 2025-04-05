import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Truck,
} from "lucide-react";

const PaymentStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

const DeliveryStatus = {
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/user/customer/orders");
      setOrders(response.data.orders || []);
      setError(null);
    } catch (err) {
      console.error("Order fetch error:", err);
      setError(err.response?.data?.error || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const PaymentStatusBadge = ({ status }) => {
    const statusConfig = {
      [PaymentStatus.PENDING]: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4 mr-2" />,
      },
      [PaymentStatus.PROCESSING]: {
        color: "bg-blue-100 text-blue-800",
        icon: <Loader2 className="w-4 h-4 mr-2 animate-spin" />,
      },
      [PaymentStatus.COMPLETED]: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4 mr-2" />,
      },
      [PaymentStatus.FAILED]: {
        color: "bg-red-100 text-red-800",
        icon: <AlertCircle className="w-4 h-4 mr-2" />,
      },
    };

    return (
      <span
        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.color}`}
      >
        {statusConfig[status]?.icon}
        {status}
      </span>
    );
  };

  const DeliveryStatusBadge = ({ status }) => {
    const statusConfig = {
      [DeliveryStatus.PROCESSING]: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Package className="w-4 h-4 mr-2" />,
      },
      [DeliveryStatus.SHIPPED]: {
        color: "bg-blue-100 text-blue-800",
        icon: <Truck className="w-4 h-4 mr-2" />,
      },
      [DeliveryStatus.OUT_FOR_DELIVERY]: {
        color: "bg-orange-100 text-orange-800",
        icon: <Truck className="w-4 h-4 mr-2 animate-bounce" />,
      },
      [DeliveryStatus.DELIVERED]: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4 mr-2" />,
      },
      [DeliveryStatus.CANCELLED]: {
        color: "bg-red-100 text-red-800",
        icon: <AlertCircle className="w-4 h-4 mr-2" />,
      },
    };

    return (
      <span
        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.color}`}
      >
        {statusConfig[status]?.icon}
        {status.replace("_", " ")}
      </span>
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

  if (!orders.length) {
    return (
      <div className="text-center p-6">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="bg-white shadow-md rounded-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Package className="mr-3 text-blue-500" />
              Order ID: {order._id}
            </h2>
            <div className="flex items-center space-x-2">
              <PaymentStatusBadge status={order.paymentStatus} />
              <DeliveryStatusBadge status={order.deliveryStatus} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-semibold flex items-center">
                <MapPin className="mr-2 text-red-500" /> Delivery Location
              </h3>
              <p>{order.location.address}</p>
            </div>
            <div>
              <h3 className="font-semibold flex items-center">
                <Clock className="mr-2 text-yellow-500" /> Order Date
              </h3>
              <p>{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">Order Breakdown</h3>
            <div className="flex justify-between">
              <span>Order Fee</span>
              <span>₹{order.subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>

          <h3 className="font-semibold mb-2">Order Items</h3>
          {order.cartItems?.map((item) => (
            <div
              key={item.productId?._id}
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
                <h4 className="font-medium">{item.productId?.name}</h4>
                <p className="text-gray-600">
                  ₹{item.productId?.price} × {item.quantity}
                </p>
              </div>
              <div className="font-semibold">
                ₹{(item.productId?.price || 0) * item.quantity}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OrderList;
