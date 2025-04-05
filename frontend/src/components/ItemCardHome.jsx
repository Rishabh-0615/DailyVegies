import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ItemCardHome = ({ product, currentUserId }) => {
  const [daysElapsed, setDaysElapsed] = useState(0);
  const [warningShown, setWarningShown] = useState(false);
  const [deleted, setDeleted] = useState(false); // Track deletion state

  useEffect(() => {
    const createdAtDate = new Date(product.createdAt);
    const currentDate = new Date();
    const diffInDays = Math.floor((currentDate - createdAtDate) / (1000 * 60 * 60 * 24));
    setDaysElapsed(diffInDays);

    // Show warning when reaching minimum shelf life
    if (diffInDays === product.minlife && product.owner?._id === currentUserId && !warningShown) {
      toast(`${product.name} is reaching its shelf life.`, {
        icon: "⚠️",
        style: { background: "#facc15", color: "#000" },
      });
      setWarningShown(true);
    }

    // Delete expired product when maxlife is reached
    if (diffInDays >= product.maxlife && !deleted) {
      deleteExpiredProduct(product._id);
    }
  }, [product, currentUserId, warningShown, deleted]);

  const deleteExpiredProduct = async (productId) => {
    try {
      const response = await axios.delete("/api/user/customer/delete", {
        data: { productId },
      });

      if (response.status === 200) {
        toast.error(`${product.name} has been removed as it exceeded its shelf life.`);
        setDeleted(true); // Prevent multiple deletions
      }
    } catch (error) {
      console.error("Error deleting expired product:", error);
      toast.error("Failed to delete expired product.");
    }
  };

  return deleted ? null : (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 w-full max-w-sm hover:scale-105">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image?.url || "https://via.placeholder.com/150"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {product.discountOffer && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {product.discountPercentage}% OFF
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
            <span className="text-sm text-gray-500">
              {new Date(product.createdAt).toLocaleDateString("en-GB")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{product.owner?.name || "Unknown Farmer"}</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">{product.category}</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">{product.city}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
            {product.discountOffer && (
              <p className="ml-2 text-sm text-green-600">
                ({product.discountPercentage}% off on {product.minQuantityForDiscount}+ items)
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Available</span>
            <p className="font-medium text-gray-800">
              {product.quantity} {product.quantityUnit}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Shelf Life</span>
            <p className="font-medium text-gray-800">
              {product.minlife}-{product.maxlife} days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCardHome;
