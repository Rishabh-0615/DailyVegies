import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you get user from auth middleware

    // Step 1: Find user's cart
    const cart = await Cart.findOne({ consumer: userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const recommendations = {};

    // Step 2: For each product in cart
    for (const cartItem of cart.items) {
      const selectedProduct = cartItem.productId;

      if (!selectedProduct) continue; // In case product got deleted

      // Step 3: Find 5 similar products
      const similarProducts = await Product.find({
        _id: { $ne: selectedProduct._id },             // Exclude current product
        category: selectedProduct.category,            // Same category
        city: selectedProduct.city,                    // Same city
        quantity: { $gt: 0 },                           // In stock
        expiryDate: { $gte: new Date() },               // Not expired
      })
      .sort({ createdAt: -1 }) // Newest first
      .limit(5);

      // Step 4: Store recommendations
      recommendations[selectedProduct._id] = similarProducts;
    }

    // Step 5: Send response
    res.json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


