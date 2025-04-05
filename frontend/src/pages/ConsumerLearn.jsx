import React from 'react';
import { MapPin, Search, Tag, ShoppingCart, Clock, Truck, ShieldCheck } from 'lucide-react';
import ConsumerNavbar from './ConsumerNavbar';

const ConsumerLearnMore = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <div className="max-w-4xl mx-auto p-6 text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">Welcome to DailyVeiges!</h1>
        <p className="text-lg text-center mb-8">Connecting you with the freshest produce from local farms in your city is our passion.</p>
        
        <div className="space-y-6">
          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <MapPin className="text-green-700" />
            <div>
              <h2 className="text-xl font-semibold">Choose Your City</h2>
              <p>Start by selecting your city. This ensures you see only the vegetables available from farmers in your area.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <Search className="text-green-700" />
            <div>
              <h2 className="text-xl font-semibold">Browse & Select</h2>
              <p>Explore the wide variety of vegetables available. Farmers post their fresh harvests directly, so you can see what's in season.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <Tag className="text-green-700" />
            <div>
              <h2 className="text-xl font-semibold">Check Out Offers</h2>
              <p>Many farmers offer special deals! Look for offers requiring a minimum purchase quantity to unlock discounts and savings.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <ShoppingCart className="text-green-700" />
            <div>
              <h2 className="text-xl font-semibold">Easy Ordering</h2>
              <p>Simply select the vegetables you want and the quantity you need. Our intuitive system makes ordering a breeze.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <Clock className="text-green-700" />
            <div>
              <h2 className="text-xl font-semibold">Order by 10 PM</h2>
              <p>To receive your fresh produce the next day, please place your order before 10 PM.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <Truck className="text-green-700" />
            <div>
              <h2 className="text-xl font-semibold">Home Delivery</h2>
              <p>Sit back and relax! We'll deliver your fresh produce right to your doorstep the following day.</p>
            </div>
          </div>

          <div className="bg-white p-5 shadow-md rounded-lg flex items-center gap-3">
            <ShieldCheck className="text-green-700 w-12 h-12" />
            <div>
              <h2 className="text-xl font-semibold">Secure Delivery</h2>
              <p>For your safety and assurance, you'll receive a one-time password (OTP) via email upon delivery. Provide this OTP to the delivery person to confirm your order and enjoy your fresh, farm-to-table meal!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerLearnMore;