import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FarmLoadingAnimation } from "../components/Loading";
import HomeNavbar from "./HomeNavbar"

import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";

import ConsumerNavbar from "../pages/ConsumerNavbar"; // Import Navbar


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");

  const { loginUser, btnLoading } = UserData();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password, role, navigate);
  };

  return (
    <>
    <HomeNavbar />
    <div className="relative min-h-screen bg-gray-100">
      
      {/* Render Navbar at the Top */}
      {/* <ConsumerNavbar /> */}

      <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.div
            className="absolute inset-0 bg-green-800 opacity-30"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>


      {/* Login Form */}
      <motion.div
        className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-2xl z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">Welcome Back!</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">Login to continue to your account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Email"
              required
            />
          </motion.div>
          <motion.div className="relative w-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="" disabled selected>
                Role
              </option>
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
              <option value="delivery boy">Delivery Boy</option>
            </select>
          </motion.div>
          <motion.button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={btnLoading}
          >
            {btnLoading ? <FarmLoadingAnimation /> : "Login"}
          </motion.button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot" className="text-green-600 hover:underline">
            Forgot Password?
          </a>
          <p className="text-sm text-gray-600 mt-2">
            Don't have an account?{" "}
            <a href="/register" className="text-green-600 hover:underline">
              Register

            </a>
           
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default Login;