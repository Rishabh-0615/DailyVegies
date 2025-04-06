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
  ThumbsUp,
  Gift,
  AlertCircle,
  MapPin,
  Tag,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("");
  const [recommendations, setRecommendations] = useState({});
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState(null);

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

  const fetchRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      const response = await axios.get("/api/user/customer/recommendations");
      setRecommendations(response.data.recommendations || {});
    } catch (err) {
      setRecommendationsError(
        err.response?.data?.error || "Failed to load recommendations. Please try again."
      );
    } finally {
      setRecommendationsLoading(false);
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

  const addToCart = async (productId) => {
    try {
      const response = await axios.post("/api/user/customer/add", {
        productId,
        quantity: 1,
      });
      setCart(response.data.cart);
      toast.success("Item added to cart");
    } catch (err) {
      console.log("Error in addToCart: ",err)
      toast.error(err.response?.data?.error || "Failed to add item to cart.");
    }
  };

  useEffect(() => {
    fetchCart();
    fetchRecommendations();
  }, []);

  const renderCartSection = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-[#19b25e]" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 text-red-500 bg-red-50 rounded-xl flex items-center shadow-md">
          <AlertCircle className="mr-3" />
          {error}
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 mb-8 border border-[#1dcc75]/20">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#19b25e] flex items-center">
            <ShoppingBasket className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" /> Your Cart
          </h1>

          {cart.items.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {cart.items.map((item) => (
                  <div
                    key={item?.productId?._id || Math.random()}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#1dcc75]/10"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="sm:w-1/3 relative">
                        {item?.productId?.image?.url ? (
                          <img
                            src={item.productId.image.url}
                            alt={item.productId.name || "Product"}
                            className="w-full h-48 sm:h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 sm:h-full bg-gray-200 flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        {item?.productId?.discountOffer && (
                          <div className="absolute top-2 right-2 bg-[#19b25e] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
                            <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {item?.productId?.discountPercentage}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 sm:p-6 sm:w-2/3 flex flex-col justify-between">
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                            {item?.productId?.name || "Unknown Product"}
                          </h2>
                          
                          {item?.productId?.category && (
                            <p className="text-[#19b25e] font-medium mb-2">
                              {item?.productId?.category}
                            </p>
                          )}
                          
                          {item?.productId?.city && (
                            <div className="flex items-center text-gray-600 mb-3">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{item?.productId?.city}</span>
                            </div>
                          )}

                          <div className="flex items-center mb-3 sm:mb-4">
                            <span className="text-xl sm:text-2xl font-bold text-[#19b25e]">
                              ₹{(item?.price || 0) * (item?.quantity || 1)}
                            </span>
                            {item?.productId?.discountOffer && (
                              <span className="ml-2 text-gray-500 line-through text-sm sm:text-base">
                                ₹{((item?.price || 0) * (item?.quantity || 1)) / (1 - (item?.productId?.discountPercentage || 0) / 100)}
                              </span>
                            )}
                          </div>

                          <div className="bg-gray-50 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4">
                            <div className="flex items-center">
                              <Carrot className="w-4 h-4 text-[#19b25e] mr-2" />
                              <span className="text-gray-700 text-sm sm:text-base">
                                Quantity: <span className="font-medium">{item?.quantity} {item?.productId?.quantityUnit || ""}</span>
                              </span>
                            </div>
                            
                            {item?.productId?.discountOffer && (
                              <div className="mt-2 text-xs sm:text-sm text-gray-600">
                                <p>Buy {item?.productId?.minQuantityForDiscount}+ {item?.productId?.quantityUnit || "items"} for {item?.productId?.discountPercentage}% discount</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => removeCartItem(item?.productId?._id)}
                            className="bg-red-50 text-red-500 px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center text-sm sm:text-base"
                          >
                            <Trash2 className="w-4 h-4 mr-1 sm:mr-2" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Order Summary</h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₹
                      {cart.items.reduce(
                        (total, item) => total + ((item?.price || 0) * (item?.quantity || 1)),
                        0
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-3 sm:my-4"></div>
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#19b25e]">
                      ₹
                      {cart.items.reduce(
                        (total, item) => total + ((item?.price || 0) * (item?.quantity || 1)),
                        0
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-[#19b25e]" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter delivery location"
                      className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-[#1dcc75]/30 focus:border-[#1dcc75] focus:ring-2 focus:ring-[#1dcc75]/20 transition-all bg-white/90 text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={handleClearCart}
                      className="sm:flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center text-sm sm:text-base"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="sm:flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-[#19b25e] text-white rounded-lg hover:bg-[#148a47] transition-colors flex items-center justify-center shadow-md text-sm sm:text-base"
                    >
                      <Utensils className="w-4 h-4 mr-2" /> Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm">
              <Tractor className="mx-auto w-16 sm:w-24 h-16 sm:h-24 text-[#19b25e] mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Add some fresh products to proceed with your order</p>
              <button 
                onClick={() => navigate("/")}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-[#19b25e] text-white rounded-lg hover:bg-[#148a47] transition-colors inline-flex items-center shadow-md text-sm sm:text-base"
              >
                <ShoppingBasket className="w-4 h-4 mr-2" /> Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRecommendationsSection = () => {
    if (recommendationsLoading) {
      return (
        <div className="flex items-center justify-center h-48 sm:h-64">
          <Loader2 className="w-8 sm:w-12 h-8 sm:h-12 animate-spin text-[#19b25e]" />
        </div>
      );
    }

    if (recommendationsError) {
      return (
        <div className="p-4 sm:p-6 text-red-500 bg-red-50 rounded-xl flex items-center shadow-md text-sm sm:text-base">
          <AlertCircle className="mr-2 sm:mr-3 flex-shrink-0" />
          {recommendationsError}
        </div>
      );
    }

    if (Object.keys(recommendations).length === 0) {
      return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-[#1dcc75]/20">
          <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-[#19b25e] flex items-center">
            <ThumbsUp className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" /> Recommended for You
          </h2>
          <div className="text-center py-8 sm:py-12">
            <Gift className="mx-auto w-12 sm:w-16 h-12 sm:h-16 text-[#19b25e] mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
              No recommendations yet
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Continue shopping to get personalized recommendations
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-[#1dcc75]/20">
        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-[#19b25e] flex items-center">
          <ThumbsUp className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" /> Recommended for You
        </h2>

        <div className="space-y-6 sm:space-y-8">
          {Object.entries(recommendations).map(([productId, recs]) => (
            <div key={productId} className="pb-4 sm:pb-6">
              <h3 className="font-medium text-gray-800 text-base sm:text-lg mb-3 sm:mb-4 flex items-center">
                <Carrot className="mr-2 text-[#19b25e] w-4 h-4 sm:w-5 sm:h-5" /> Products you might like
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {recs.map((recProduct) => (
                  <div
                    key={recProduct._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-[#1dcc75]/10"
                  >
                    {/* Product Image or Placeholder */}
                    <div className="relative h-36">
                      {recProduct.image?.url ? (
                        <img
                          src={recProduct.image.url}
                          alt={recProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                      {recProduct.discountOffer && (
                        <div className="absolute top-2 right-2 bg-[#19b25e] text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Tag className="w-3 h-3 mr-0.5" />
                          {recProduct.discountPercentage}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-3 sm:p-4">
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base mb-1">
                        {recProduct.name}
                      </h4>
                      <p className="text-[#19b25e] font-medium text-xs sm:text-sm mb-1 sm:mb-2">
                        {recProduct.category}
                      </p>
                      <div className="flex items-center text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>{recProduct.city}</span>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm sm:text-base font-bold text-[#19b25e]">
                          ₹{recProduct.price}
                          <span className="text-xxs sm:text-xs text-gray-500 font-normal ml-0.5">
                            /{recProduct.quantityUnit || "item"}
                          </span>
                        </span>
                        <button
                          onClick={() => addToCart(recProduct._id)}
                          className="bg-[#19b25e] text-white p-1.5 sm:p-2 rounded-lg hover:bg-[#148a47] transition-colors"
                        >
                          <ShoppingBasket className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fdf9] via-white to-[#f8fdf9]">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#19b25e]">Your Shopping Cart</h1>
          <p className="text-gray-600 text-sm sm:text-base">Complete your purchase or continue shopping</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          <div className="w-full lg:w-7/10">
            {renderCartSection()}
          </div>
          <div className="w-full lg:w-3/10">
            {renderRecommendationsSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;