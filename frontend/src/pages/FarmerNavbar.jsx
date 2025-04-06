import React, { useState, useEffect } from "react";
import { User, Menu, X, LogOut, Home, Tractor, ListPlus, ShoppingBag, Users, MessageCircle, TrendingUp, Satellite, Sun } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import toast from "react-hot-toast";
import axios from "axios";
import myimg from "../assets/logo.png";

const FarmerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuth, setUser } = UserData();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      toast.success(data.message);
      setIsAuth(false);
      setUser([]);
      navigate("/");
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      toast.error(errorMessage);
    }
  };

  const navLinks = [
    { name: "Home", path: "/farmer", icon: <Home size={18} /> },
    { name: "My Listings", path: "/mylistings", icon: <Tractor size={18} /> },
    { name: "Add Product", path: "/addproduct", icon: <ListPlus size={18} /> },
    { name: "Orders", path: "/farmerorder", icon: <ShoppingBag size={18} /> },
    { name: "Community", path: "/forum", icon: <Users size={18} /> },
    { name: "AI ChatBot", path: "/chat", icon: <MessageCircle size={18} /> },
    { name: "Predict", path: "/predict", icon: <TrendingUp size={18} /> }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-green-600 shadow-lg" : "bg-green-500"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Name Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img
                src={myimg}
                alt="Farm To Table"
                className="w-10 h-10 rounded-lg shadow-md transform group-hover:scale-105 transition-transform duration-200"
              />
              <div className="ml-2 flex flex-col">
                <span className="text-xl font-bold text-white group-hover:text-white transition-all duration-200">
                  DailyVegies
                </span>
                <span className="text-xs text-green-100">Farmer Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center whitespace-nowrap
                  ${isActive(link.path) 
                    ? "bg-green-700 text-white shadow-md" 
                    : "text-green-50 hover:bg-green-600 hover:text-white"
                  } transition-all duration-200`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.name}
              </Link>
            ))}
            <button
              onClick={logoutHandler}
              className="ml-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-all duration-200 flex items-center text-sm font-medium border border-white/20"
            >
              <LogOut size={18} className="mr-1.5" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-green-100 focus:outline-none transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        } lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-green-600 shadow-xl`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center
                ${isActive(link.path)
                  ? "bg-green-700 text-white" 
                  : "text-green-100 hover:bg-green-500 hover:text-white"
                }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </Link>
          ))}
          <button
            onClick={logoutHandler}
            className="w-full mt-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-all duration-200 flex items-center text-base font-medium"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default FarmerNavbar;