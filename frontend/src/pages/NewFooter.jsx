import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-green-500 text-white py-8 text-center relative">
      <div className="absolute inset-0 bg-black opacity-0 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className=" mb-4">
              Creating amazing digital experiences since 2020. We're passionate about delivering value to our customers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className=" hover:text-white">Home</a></li>
              <li><a href="#" className=" hover:text-white">Services</a></li>
              <li><a href="#" className=" hover:text-white">About</a></li>
              <li><a href="#" className=" hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className=" mb-2">Pune Institute of Computer Technology</p>
            <p className=" mb-2">Pune, 411006</p>
            <p className=" mb-2">Phone: (555) 123-4567</p>
            <p className="">Email: info@mywebsite.com</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className=" hover:text-white">
            <Facebook size={24} />
          </a>
          <a href="#" className=" hover:text-white">
            <Twitter size={24} />
          </a>
          <a href="#" className=" hover:text-white">
            <Instagram size={24} />
          </a>
          <a href="#" className=" hover:text-white">
            <Mail size={24} />
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6">
          <p className="">&copy; 2025 My Website. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;