import React, { useEffect, useState } from "react";
import { ProductData } from "../context/FarmerContext";
import ItemCard from "../components/ItemCard";
import { Loading } from "../components/Loading";
import { toast } from "react-hot-toast";
import axios from "axios";

const MyListings = ({ user }) => {
  const { product, fetchProduct, setProduct, loading } = ProductData();
  

  useEffect(() => {
    fetchProduct(); // Fetch all products when component mounts
    
  }, []);

  // Delete product function
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete("/api/user/farmer/delete", {
        data: { id: productId }, // Send product ID in request body
      });
      toast.success(data.message);

      // Update local state to remove the deleted product
      setProduct((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  // Edit product function
  const handleEdit = async (productId, updatedDetails) => {
    try {
      const { data } = await axios.put("/api/user/farmer/edit", {
        id: productId,
        ...updatedDetails,
      });
      toast.success(data.message);

      // Update local state with edited product
      setProduct((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, ...updatedDetails } : product
        )
      );
    } catch (error) {
      console.error("Edit Error:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };

  const userProducts = product?.filter((product) => product.owner._id === user._id);


  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">My Product Listings</h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {userProducts && userProducts.length > 0 ? (
                userProducts.map((product) => (
                  <ItemCard
                    key={product._id}
                    product={product}
                    handleDelete={handleDelete} // Pass delete handler to ItemCard
                    handleEdit={handleEdit} // Pass edit handler to ItemCard
                  />
                ))
              ) : (
                <p className="text-xl text-gray-500">You haven't listed any products yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;