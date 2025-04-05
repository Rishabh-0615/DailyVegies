import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const NewFooter = () => {
  return (
    <footer className="bg-transparent text-white py-8 text-center relative">
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-300 mb-4">
              Creating amazing digital experiences since 2020. We're passionate about delivering value to our customers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-300 mb-2">123 Business Street</p>
            <p className="text-gray-300 mb-2">New York, NY 10001</p>
            <p className="text-gray-300 mb-2">Phone: (555) 123-4567</p>
            <p className="text-gray-300">Email: info@mywebsite.com</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="text-gray-300 hover:text-white">
            <Facebook size={24} />
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            <Twitter size={24} />
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            <Instagram size={24} />
          </a>
          <a href="#" className="text-gray-300 hover:text-white">
            <Mail size={24} />
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6">
          <p className="text-gray-300">&copy; 2025 My Website. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;