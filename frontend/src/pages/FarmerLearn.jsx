import React from 'react';
import { UserPlus, CheckCircle, Image, Tag, Edit, ListOrdered, CalendarCheck } from 'lucide-react';

const FarmerLearnMore = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to DailyVeiges!</h1>
        <p className="text-lg text-center mb-8">We're excited to partner with local farmers like you to bring fresh produce to our community.</p>
        
        <div className="space-y-6">
          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <UserPlus className="text-green-700" />
            <div>
              <h2 className="text-xl font-semibold">Register & Request</h2>
              <p>Begin by registering your farm with us. After registration, send a request to the admin for approval.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <CheckCircle className="text-green-700" />
            <div>
              <h2 className="text-xl font-semibold">Admin Approval</h2>
              <p>Our admin team will review your request. Once approved, you'll gain access to start selling your products.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <Image className="text-green-700 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold">List Your Products</h2>
              <p>Upload high-quality images of your crops/produce. Then, provide essential details like available quantity, price per unit, and any relevant information.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <Tag className="text-green-700 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold">Set Up Offers</h2>
              <p>Want to offer special deals? You can easily set up offers by specifying a percentage discount and the minimum purchase quantity required to unlock the offer.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <Edit className="text-green-700 w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold">Manage Your Listings</h2>
              <p>Need to adjust your product details? You can easily edit your listings to add more quantity, increase prices, or make other necessary changes.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <CalendarCheck className="text-green-700 w-12 h-12" />
            <div>
              <h2 className="text-xl font-semibold">Daily Order Summary</h2>
              <p>Every day at 10 PM, you'll receive a consolidated order summary detailing the total quantity of each product you need to send to the designated hub for delivery. This helps you efficiently manage your harvest and deliveries.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerLearnMore;