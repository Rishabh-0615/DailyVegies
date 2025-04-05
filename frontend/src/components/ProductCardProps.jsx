import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCardProps({ id, name, price, image, category }) {
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate(); // React Router's navigation function

  const handleAddToCart = () => {
    // Simulate adding to cart
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
  };

  const handleNavigate = () => {
    navigate(`/products/${category}/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
      <div onClick={handleNavigate} className="cursor-pointer">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3
          onClick={handleNavigate}
          className="text-lg font-semibold mb-2 cursor-pointer transition-colors duration-300 hover:text-green-600"
        >
          {name}
        </h3>
        <p className="text-gray-600 mb-4">${price}</p>
        <button
          onClick={handleAddToCart}
          className={`w-full px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
            isAdded ? "bg-green-600 text-white" : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isAdded ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
