import React, { useState } from "react";
import axios from "axios";
import { FaGooglePay, FaCreditCard } from "react-icons/fa";
import { RiPhoneFill } from "react-icons/ri";

function AddToCart() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handleMockPayment = async () => {
    if (!selectedPaymentMethod) {
      setStatus("Please select a payment method");
      return;
    }

    try {
      setStatus("Processing payment...");
      const response = await axios.post("/api/user/customer/mock-payment", {
        amount: amount,
        currency: "INR",
        paymentMethod: selectedPaymentMethod,
      });

      setStatus(`Payment Successful! Payment ID: ${response.data.payment_id}`);
    } catch (error) {
      setStatus("Payment Failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">Mock Payment Gateway</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">
            Enter Payment Amount (INR)
          </label>
          <input
            type="number"
            id="amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
          <div className="flex justify-around">
            <button
              className={`flex flex-col items-center p-4 border rounded-lg w-20 ${
                selectedPaymentMethod === "Google Pay" ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => setSelectedPaymentMethod("Google Pay")}
            >
              <FaGooglePay size={40} className="text-blue-600" />
              <span className="text-sm mt-2">Google Pay</span>
            </button>
            <button
              className={`flex flex-col items-center p-4 border rounded-lg w-20 ${
                selectedPaymentMethod === "PhonePe" ? "ring-2 ring-purple-400" : ""
              }`}
              onClick={() => setSelectedPaymentMethod("PhonePe")}
            >
              <RiPhoneFill size={40} className="text-purple-600" />
              <span className="text-sm mt-2">PhonePe</span>
            </button>
            <button
              className={`flex flex-col items-center p-4 border rounded-lg w-20 ${
                selectedPaymentMethod === "Card" ? "ring-2 ring-gray-400" : ""
              }`}
              onClick={() => setSelectedPaymentMethod("Card")}
            >
              <FaCreditCard size={40} className="text-gray-700" />
              <span className="text-sm mt-2">Card</span>
            </button>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition"
          onClick={handleMockPayment}
        >
          Proceed to Pay
        </button>

        {status && (
          <p className={`mt-4 text-sm font-medium text-center ${status.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

export default AddToCart;
