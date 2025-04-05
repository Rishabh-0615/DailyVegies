import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    consumer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 }, // Ensure this field is defined
  },
  { timestamps: true }
);
cartSchema.methods.calculateTotalPrice = function () {
  this.totalPrice = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
};

cartSchema.pre("save", function (next) {
  this.calculateTotalPrice();
  next();
});


export const Cart = mongoose.model("Cart", cartSchema);
