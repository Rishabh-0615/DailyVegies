import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import left from "../assets/home-img .png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const elements = document.querySelectorAll(".scroll-animate");
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.75;
        if (isInView) {
          element.classList.add("animate-in");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 w-full z-20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <span className="ml-2 text-white text-xl font-semibold">
                  DailyVegies
                </span>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 hover:bg-green-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop and mobile menu */}
            <div
              className={`
                ${isOpen ? "translate-x-0" : "translate-x-full"}
                text-green-500
                lg:translate-x-0
                fixed lg:relative
                top-0 lg:top-auto
                right-0
                h-screen lg:h-auto
                w-30vw md:w-64 lg:w-auto
                lg:bg-transparent
                p-6 lg:p-0
                transform transition-all duration-300 ease-in-out
                lg:flex lg:items-center
                z-50 lg:z-auto
                shadow-lg lg:shadow-none
                mt-16 lg:mt-0
              `}
            >
              <ul className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                <li className="w-full lg:w-auto">
                  <a
                    href="/register"
                    className="block w-full lg:w-auto px-6 py-2.5 text-white text-sm font-medium rounded-lg border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-300 text-center lg:text-left"
                  >
                    Register
                  </a>
                </li>
                <li className="w-full lg:w-auto">
                  <a
                    href="/login"
                    className="block w-full lg:w-auto px-6 py-2.5 text-white text-sm font-medium rounded-lg border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-300 text-center lg:text-left"
                  >
                    Login
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen px-4 sm:px-8 lg:px-12 pt-24 lg:pt-16 pb-8 lg:pb-2">
        {/* Left Image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center">
          <img 
            src={left} 
            alt="Fresh vegetables" 
            className="w-full max-w-xl h-auto object-contain mt-16 lg:mt-0"
          />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex flex-col text-left">
          <h1 className="text-4xl lg:text-6xl font-bold text-white">
            From Our Fields to Your Family Table
          </h1>
          <p className="mt-4 text-xl lg:text-2xl text-white">
            We connect you with local farmers, bringing the freshest, healthiest
            ingredients to your kitchen. Taste the love in every bite.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;