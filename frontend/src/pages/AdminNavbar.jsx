import React, { useState } from "react";
import { User, Menu, X, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import toast from "react-hot-toast";
import axios from "axios";
import myimg from "../assets/logo.png";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { setIsAuth, setUser } = UserData();
  const [isOpen, setIsOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await axios.get("/api/admin/logout", { withCredentials: true });
      toast.success("Logged out successfully.");
      navigate("/admin-login"); // Redirect to login on logout
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Failed to log out.");
    }
  };

  return (
    <nav className="bg-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Name Section */}
          <div className="flex items-center">
            <a href="/" className="flex items-center group">
              <img
                src={myimg}
                alt="Farm To Table"
                className="w-10 h-10 rounded-lg shadow-md transform group-hover:scale-105 transition-transform duration-200"
              />
              <span className="ml-2 text-xl font-bold text-[#faeedc] group-hover:text-white transition-all duration-200 transform group-hover:translate-x-1">
                DailyVegies
              </span>
            </a>
          </div>

          {/* Navigation Menu */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <div className="block lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[#faeedc] hover:text-white focus:outline-none transition-all duration-200 transform hover:scale-110"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Menu Items */}
            <div
              className={`${
                isOpen
                  ? "block absolute top-16 right-0 w-48 bg-gradient-to-r from-[#1dcc75] to-[#19b25e] shadow-xl rounded-bl-lg"
                  : "hidden"
              } lg:relative lg:flex lg:items-center lg:space-x-6 lg:bg-transparent lg:w-auto`}
            >
              <ul className="flex flex-col lg:flex-row lg:space-x-4 p-2 lg:p-0">
                <li>
                  <a
                    href="/farmer"
                    className="block px-4 py-2 text-[#faeedc] hover:text-white rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:bg-white/10 h-10"
                  >
                    <Home className="mr-0 h-7 w-7" />
                  </a>
                </li>
                <li>
                  <a
                    href="/verify"
                    className="block px-4 py-2 text-[#faeedc] hover:text-white rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:bg-white/10"
                  >
                    Verify Farmer
                  </a>
                </li>
                
                <li>
                  <a
                    href="/verify-delivery"
                    className="block px-4 py-2 text-[#faeedc] hover:text-white rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:bg-white/10"
                  >
                    Verify Delivery Boy
                  </a>
                </li>
                <li>
                  <a
                    href="/addproduct"
                    className="block px-4 py-2 text-[#faeedc] hover:text-white rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:bg-white/10"
                  >
                    Add Product
                  </a>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="w-full lg:w-auto px-4 py-2 bg-[#1bc06d] hover:bg-[#159a58] text-[#faeedc] rounded-lg transition-all duration-200 shadow-md hover:shadow-xl hover:text-white transform hover:-translate-y-1 hover:scale-105 border border-transparent hover:border-white/20 flex items-center"
                  >
                    <LogOut className="mr-2" />
                    Logout
                  </button>
                </li>
               
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;