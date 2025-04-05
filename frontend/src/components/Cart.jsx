import React from "react";
import { ShoppingCart, Trash2 } from "lucide-react";

const cartItems = [
  { id: 1, name: "Fresh Strawberries", price: 3.99, quantity: 2, image: "/images/strawberries.jpg" },
  { id: 2, name: "Organic Eggs", price: 4.5, quantity: 1, image: "/images/eggs.jpg" },
  { id: 3, name: "Homemade Bread", price: 5.99, quantity: 1, image: "/images/bread.jpg" },
];

export default function Cart() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-b-0">
                <div className="flex items-center">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
            <button className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors w-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Confirm Order
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <a
            href="/"
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors inline-block"
          >
            Start Shopping
          </a>
        </div>
      )}
    </div>
  );
}
