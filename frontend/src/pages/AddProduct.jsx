import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ProductData } from "../context/FarmerContext";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { useEffect } from "react";


const LoadingAnimation = () => (
  <div className="flex justify-center items-center">
    <div className="spinner border-t-transparent border-4 border-green-500 rounded-full w-6 h-6 animate-spin"></div>
  </div>
);

const AddProduct = () => {
  const shelfLifeOptions = {
    Vegetable: ["3-5 days", "5-7 days", "7-10 days", "10-14 days"],
    Fruit: ["2-4 days", "4-7 days", "7-10 days", "10-14 days"],
    Grains: ["15-30 days", "30-60 days", "60-90 days", "90+ days"],
  };
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [filePrev, setFilePrev] = useState("");
  const [loading, setLoading] = useState(false);
  const { addProduct } = ProductData();
  const { user } = UserData();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();


  const selectedCategoryValue = watch("productCategory");
  const isDiscountOfferEnabled = watch("discountOffer");
  const categoryError = !selectedCategoryValue && "Please select a category first.";

  const productOptions = {
    Vegetable: ["Carrot", "Tomato", "Cabbage", "Spinach","Corn"],
    Fruit: ["Apples", "Watermelon", "Mango", "Banana"],
    Grains: ["Rice", "Wheat", "Corn", "Barley"],
  };

  const handleClick = () => inputRef.current.click();

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(file);
    };
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    // ... (keeping the same form submission logic)

    formData.append("category", data.productCategory);
    formData.append("name", data.productName);
    formData.append("quantity", data.quantity);
    formData.append("weight", data.weight);
    formData.append("price", data.price);
    formData.append("location", data.location);
    formData.append("condition", data.condition);
    formData.append("notes", data.notes);
    formData.append("file", file);
    formData.append("userId", user.id);
    formData.append("life", data.life);
    formData.append("city", data.city);
    formData.append("quantityUnit", data.quantityUnit);
    formData.append("minlife",data.minlife);
    formData.append("maxlife",data.maxlife);

    // Add discount offer data if enabled
    if (isDiscountOfferEnabled) {
      formData.append("discountOffer", true);
      formData.append("minQuantityForDiscount", data.minQuantityForDiscount);
      formData.append("discountPercentage", data.discountPercentage);
    } else {
      formData.append("discountOffer", false);
    }

    const listingDate = new Date().toISOString();
    formData.append("listingDate", listingDate);
    console.log(formData.quantityUnit)

    try {
      await addProduct(formData, setFilePrev, setFile, navigate);
    } catch (error) {
      console.error("Failed to add product:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
          <div className="bg-gradient-to-r from-green-600 to-green-400 p-6">
            <h1 className="text-3xl font-bold text-white text-center">Add New Product</h1>
          </div>

          <div className="p-8">
            {/* Image Upload Section */}
            <div className="mb-8">
              <div className="relative group">
                <div className="flex flex-col items-center justify-center w-full h-72 border-3 border-dashed border-green-300 rounded-xl bg-green-50 transition-all duration-300 group-hover:border-green-400 group-hover:bg-green-100">
                  {filePrev ? (
                    <img src={filePrev} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full cursor-pointer" onClick={handleClick}>
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={changeFileHandler}
                      />
                      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-green-200 text-green-600 rounded-full transition-transform duration-300 transform group-hover:scale-110">
                        <FaPlus size={24} />
                      </div>
                      <p className="text-green-600 font-medium">Choose a file</p>
                      <p className="mt-2 text-sm text-green-500">High-quality .jpg files recommended (max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category and Product Name */}
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-green-600">
                      Product Category
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
                      {...register("productCategory", { required: "Product Category is required" })}
                    >
                      <option value="">Select a category</option>
                      <option value="Vegetable">Vegetable</option>
                      <option value="Fruit">Fruit</option>
                      <option value="Grains">Grains</option>
                    </select>
                    {errors.productCategory && (
                      <p className="mt-1 text-red-500 text-sm">{errors.productCategory.message}</p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-green-600">
                      Product Name
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
                      {...register("productName", { required: "Product name is required" })}
                      disabled={!selectedCategoryValue}
                    >
                      <option value="">
                        {selectedCategoryValue ? "Select a product" : "Please select category first"}
                      </option>
                      {selectedCategoryValue &&
                        productOptions[selectedCategoryValue]?.map((product) => (
                          <option key={product} value={product}>
                            {product}
                          </option>
                        ))}
                    </select>
                    {!selectedCategoryValue && <p className="mt-1 text-red-500 text-sm">{categoryError}</p>}
                    {errors.productName && <p className="mt-1 text-red-500 text-sm">{errors.productName.message}</p>}
                  </div>
                </div>

                {/* Quantity and Price */}
                <div className="space-y-6">
                  {/* Quantity Section */}
                  <div className="grid grid-cols-[5fr_0.1fr] gap-6 items-end">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-green-600">
                        Quantity Available
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
                          {...register("quantity", {
                            required: "Quantity is required",
                            min: { value: 1, message: "Value must be greater than 0" },
                          })}
                        />

                      </div>
                      {errors.quantity && <p className="mt-1 text-red-500 text-sm">{errors.quantity.message}</p>}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-green-600">
                        Unit
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
                        {...register("quantityUnit", { required: "Product quantity unit is required" })}
                      >
                        <option value="">Select a Unit</option>
                        <option value="Kg">Kg</option>
                        <option value="Piece">Piece</option>

                      </select>
                      {errors.quantityUnit && (
                        <p className="mt-1 text-red-500 text-sm">{errors.quantityUnit.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="grid grid-cols-[15fr_0.2fr] gap-6 items-end">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-green-600">
                        Price (per unit)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
                          {...register("price", {
                            required: "Price is required",
                            min: { value: 1, message: "Value must be greater than 0" },
                          })}
                        />

                      </div>
                      {errors.price && <p className="mt-1 text-red-500 text-sm">{errors.price.message}</p>}
                    </div>
                  </div>
                </div>
              </div>


              {/* Discount Section */}
              <div className="p-6 bg-green-50 rounded-xl space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500"
                    {...register("discountOffer")}
                  />
                  <label className="text-sm font-semibold text-gray-700">
                    Offer discount for bulk purchases
                  </label>
                </div>

                {isDiscountOfferEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Minimum Quantity
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
                        {...register("minQuantityForDiscount", {
                          required: "Minimum quantity is required",
                          min: { value: 1, message: "Value must be greater than 0" },
                        })}
                      />
                      {errors.minQuantityForDiscount && (
                        <p className="mt-1 text-red-500 text-sm">{errors.minQuantityForDiscount.message}</p>
                      )}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Discount Percentage (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
                        {...register("discountPercentage", {
                          required: "Discount percentage is required",
                          min: { value: 1, message: "Value must be greater than 0" },
                          max: { value: 100, message: "Value must be less than or equal to 100" },
                        })}
                      />
                      {errors.discountPercentage && (
                        <p className="mt-1 text-red-500 text-sm">{errors.discountPercentage.message}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Location and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-green-600">
                    Farm Location
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
                    {...register("city", { required: "Farm City is required" })}
                  >
                    <option value="">Select a city</option>
                    <option value="Kolhapur">Kolhapur</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-red-500 text-sm">{errors.city.message}</p>
                  )}
                </div>

                <div className="group">
  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-green-600">
    Shelf Life (Days):
  </label>
  <div className="flex items-center gap-2">
    <input
      type="number"
      className="w-1/3 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
      placeholder="Min days"
      {...register("minlife", { required: "Minimum shelf life is required", valueAsNumber: true })}
      disabled={!selectedCategoryValue}
    />
    <span className="text-gray-600">To</span>
    <input
      type="number"
      className="w-1/3 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
      placeholder="Max days"
      {...register("maxlife", { required: "Maximum shelf life is required", valueAsNumber: true })}
      disabled={!selectedCategoryValue}
    />
    <span className="text-gray-600">Days</span>
  </div>
  {errors.minLife && <p className="mt-1 text-red-500 text-sm">{errors.minLife.message}</p>}
  {errors.maxLife && <p className="mt-1 text-red-500 text-sm">{errors.maxLife.message}</p>}
  
</div>

              </div>

              {/* Notes */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-hover:text-green-600">
                  Additional Notes (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300"
                  rows="4"
                  {...register("notes")}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-400 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-green-700 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? <LoadingAnimation /> : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;