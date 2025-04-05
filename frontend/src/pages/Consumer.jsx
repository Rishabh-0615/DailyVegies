import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, MapPin } from "lucide-react";
import ItemCardConsumer from "../components/ItemCardConsumer";
import HeroSectionConsumer from "./HeroSectionConsumer";
import NewFooter from "./Footer";
import Footer from "./NewFooter";

const Consumer = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const AVAILABLE_CITIES = ["Kolhapur", "Pune", "Mumbai"];

  // Load previously selected city from localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  // Save selected city to localStorage when user changes it
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    localStorage.setItem("selectedCity", city);
  };

  // Fetch all products from the backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/user/farmer/all");
      setProducts(response.data);

      // Extract categories dynamically
      const uniqueCategories = [...new Set(response.data.map((product) => product.category))];
      setCategories(uniqueCategories);

      setError(null);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search functionality with debounce
  const handleSearchChange = (e) => {
    const queryText = e.target.value;
    setQuery(queryText);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      searchProducts(queryText);
    }, 300);
    setDebounceTimeout(timeout);
  };

  const searchProducts = async (queryText) => {
    if (!queryText) {
      fetchProducts();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`/api/user/customer/search?query=${queryText}`);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  // Filtering functions
  const getFilteredProducts = () => {
    let filteredProducts = [...products];

    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory);
    }

    if (showDiscountOnly) {
      filteredProducts = filteredProducts.filter((product) => product.discountOffer);
    }

    return filteredProducts;
  };

  // Filter by city
  const getFilteredProductsByCity = () => {
    let filteredProducts = getFilteredProducts();

    if (selectedCity) {
      filteredProducts = filteredProducts.filter((product) => product.city === selectedCity);
    }

    return filteredProducts;
  };

  // Sorting
  const getSortedProducts = () => {
    let filteredProducts = getFilteredProductsByCity();

    if (sortBy === "latest") {
      return filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sortBy === "priceLowToHigh") {
      return filteredProducts.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "priceHighToLow") {
      return filteredProducts.sort((a, b) => b.price - a.price);
    }
    return filteredProducts;
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const sortedProducts = getSortedProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fdf9] via-white to-[#f8fdf9]">
      <HeroSectionConsumer />
      <div className="container mx-auto px-4 py-8">
        {/* Header with City Selection */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#19b25e]">Fresh Products</h2>
            <p className="text-gray-600">Discover fresh, locally sourced products from farmers near you</p>
          </div>
          
          {/* City Selection Dropdown */}
          <div>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="px-4 py-3 border border-[#1dcc75]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1dcc75] bg-white/90 w-full md:w-48 hover:border-[#1dcc75] transition-colors"
            >
              <option value="">Select City</option>
              {AVAILABLE_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* City Selection Prompt */}
        {!selectedCity && (
          <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-12 text-center">
            <MapPin className="w-16 h-16 text-[#19b25e] mb-6" />
            <h3 className="text-2xl font-bold text-[#19b25e] mb-4">Choose Your City First</h3>
            <p className="text-gray-600 mb-6">
              Select a city to view local farmers' fresh products. This helps us show you the most relevant items.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Available Cities: {AVAILABLE_CITIES.join(", ")}
            </p>
          </div>
        )}

        {/* Filters and Products Section */}
        {selectedCity && (
          <>
            {/* Filter & Search Section */}
            <div className="g-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-[#1dcc75]/20">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#19b25e]" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#1dcc75]/30 focus:border-[#1dcc75] focus:ring-2 focus:ring-[#1dcc75]/20 transition-all bg-white/90"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-[#1dcc75]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1dcc75] bg-white/90 md:w-48 w-full hover:border-[#1dcc75] transition-colors"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Discount Filter */}
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showDiscountOnly}
                    onChange={() => setShowDiscountOnly(!showDiscountOnly)}
                    className="w-5 h-5 text-[#1dcc75] border-[#1dcc75]/30 focus:ring-[#1dcc75] rounded"
                  />
                  <span className="text-gray-700 group-hover:text-[#19b25e] transition-colors">Discount Only</span>
                </label>
              {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-[#1dcc75]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1dcc75] bg-white/90 md:w-48 w-full hover:border-[#1dcc75] transition-colors"
            >
              <option value="latest">Latest</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
            </select>
            </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <ItemCardConsumer key={product._id} product={product} />
                ))
              ) : (
                <p className="text-gray-600 text-center col-span-full">No products found in {selectedCity}.</p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>  
  );
};

export default Consumer;
