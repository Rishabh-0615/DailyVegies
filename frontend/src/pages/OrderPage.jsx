import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/user/customer/getorder");
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-md shadow-md bg-white"
            >
              <h2 className="text-lg font-bold mb-2">Order ID: {order._id}</h2>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Total Price: ₹{order.finalPrice}</p>
              <p>Delivery Fee: ₹{order.deliveryFee}</p>
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold">Products:</h3>
                {order.products.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex justify-between items-center"
                  >
                    <p>{item.productId.name}</p>
                    <p>
                      {item.quantity} x ₹{item.productId.price} = ₹
                      {item.quantity * item.productId.price}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4">
                Delivery Address: Lat: {order.consumerLocation.lat}, Lon:{" "}
                {order.consumerLocation.lon}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
