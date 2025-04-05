import { useState, useEffect } from "react";
import axios from "axios";

const ProductSearch = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const response = await axios.get(`/api/products/search?query=${query}`);
      setProducts(response.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="border rounded-md p-2 w-full"
      />
      <button onClick={handleSearch} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">
        Search
      </button>

      <div className="mt-4">
        {products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product._id} className="py-2 border-b">
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
