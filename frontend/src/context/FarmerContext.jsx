import axios from "axios";
import { createContext, useContext,useState } from "react";
import { toast } from "react-hot-toast";
import { UserData } from "./UserContext";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const addProduct = async (formData, setFilePrev, setFile, navigate) => {
    try {
      const { data } = await axios.post("/api/user/farmer/addproduct", formData);
      toast.success(data.message);
      setFilePrev("");
      setFile("");
      navigate("/farmer");
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add product. Please try again.");
    }
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuth} = UserData();

  async function fetchProducts() {
    try {
      const { data } = await axios.get("/api/user/farmer/all");

      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const [product, setProduct] = useState([]);

  async function fetchProduct() {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/user/farmer/myproducts");

      setProduct(data);
      console.log(data)
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <ProductContext.Provider value={{ addProduct,
        product,
        setProduct,
        setProducts,
        products,
        loading,
        setLoading,
        isAuth,
        fetchProduct,
        fetchProducts,

     }}>
      {children}
    </ProductContext.Provider>
  );
};

export const ProductData = () => useContext(ProductContext);
