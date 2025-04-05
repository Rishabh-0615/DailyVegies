import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginAdmin, btnLoading } = UserData();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAdmin(email, password, navigate);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Login Form */}
      <motion.div
        className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="email"
              required
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Password"
              required
            />
          </motion.div>
          <motion.button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={btnLoading}
          >
            {btnLoading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
