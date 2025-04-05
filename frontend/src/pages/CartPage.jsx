import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Trash2,
  Tractor,
  Wheat,
  Carrot,
  Utensils,
  ShoppingBasket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/user/customer/getcart");
      setCart({
        items: response.data.items || [],
        totalPrice: response.data.totalPrice || 0,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (productId) => {
    try {
      const response = await axios.post("/api/user/customer/add", {
        productId,
        remove: true,
      });
      setCart(response.data.cart);
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to remove item.");
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await axios.post("/api/user/customer/clear");
      if (response.data.message) {
        setCart({ items: [], totalPrice: 0 });
        toast.success("Cart cleared");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to clear cart.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!location) {
      toast.error("Please enter a delivery location");
      return;
    }

    const computedTotalPrice = cart.items.reduce((acc, item) => {
      return acc + ((item?.price || 0) * (item?.quantity || 1));
    }, 0);

    if (computedTotalPrice <= 0) {
      toast.error("Cart is empty. Add some items before placing an order.");
      return;
    }

    try {
      const response = await axios.post("/api/user/customer/save", {
        cartItems: cart.items,
        totalPrice: computedTotalPrice,
        locationAddress: location,
      });

      if (response.data.message) {
        toast.success("Order placed successfully!");
        setCart({ items: [], totalPrice: 0 });
        navigate("/order");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to place order");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md flex items-center">
        <Wheat className="mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl bg-green-50">
      <h1 className="text-3xl font-bold mb-6 text-green-800 flex items-center">
        <ShoppingBasket className="mr-3" /> Your Cart
      </h1>

      {cart.items.length > 0 ? (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item?.productId?._id || Math.random()}
              className="border rounded-lg shadow-sm bg-white p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {item?.productId?.image?.url && (
                    <img
                      src={item.productId.image.url}
                      alt={item.productId.name || "Product"}
                      className="w-24 h-24 object-cover rounded-md border-2 border-green-200"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-green-900">
                      {item?.productId?.name || "Unknown Product"}
                    </h2>
                    <p className="text-green-700">
                      Quantity: {item?.quantity} {item?.productId?.quantityUnit || ""}
                    </p>
                    {item?.productId?.discountOffer && (
                      <p className="text-green-600 text-sm">
                        <Carrot className="inline mr-1" />
                        {item?.productId?.discountPercentage}% discount on {item?.productId?.minQuantityForDiscount}+ items
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <p className="text-lg font-semibold text-green-800">
                    ₹{(item?.price || 0) * (item?.quantity || 1)}
                  </p>
                  <button
                    onClick={() => removeCartItem(item?.productId?._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 space-y-4">
            <div className="bg-green-100 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>
                  ₹
                  {cart.items.reduce(
                    (total, item) => total + ((item?.price || 0) * (item?.quantity || 1)),
                    0
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter delivery location"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleClearCart}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="mr-2" /> Clear Cart
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Utensils className="mr-2" /> Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Tractor className="mx-auto w-24 h-24 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-green-900">
            Your cart is empty
          </h2>
          <p className="text-green-700">Add some items to proceed with your order</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
