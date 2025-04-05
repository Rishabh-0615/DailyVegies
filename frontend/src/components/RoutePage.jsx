import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const RoutePage = () => {
  const [reverseAddress, setReverseAddress] = useState('');
  const [origin, setOrigin] = useState('');
  const [destinations, setDestinations] = useState('');
  const [optimizedRoute, setOptimizedRoute] = useState(null);

  

  const handleReverseGeocode = async () => {
    const [lat, lon] = reverseAddress.split(',').map(Number);
    try {
      const response = await axios.post('/api/user/customer/reverse', { lat, lon });
      toast.success('Reverse geocoding successful!');
    } catch (error) {
      toast.error('Failed to reverse geocode coordinates.');
    }
  };

  const handleOptimizeRoute = async () => {
    const destinationsArray = destinations.split(';').map((dest) => {
      const [lat, lon] = dest.split(',');
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    });
    try {
      const response = await axios.post('/api/user/customer/optimize', {
        origin: { lat: 28.7041, lon: 77.1025 }, // Example origin (New Delhi)
        destinations: destinationsArray
      });
      setOptimizedRoute(response.data.routes);
      toast.success('Route optimization successful!');
    } catch (error) {
      toast.error('Failed to optimize routes.');
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-8">Google API Integration</h1>

        {/* Geocoding */}
        <div className="mb-6">
         
          {coordinates && (
            <div className="mt-4 bg-blue-50 p-4 rounded-md">
              <p className="text-gray-700">Latitude: {coordinates.lat}</p>
              <p className="text-gray-700">Longitude: {coordinates.lng}</p>
            </div>
          )}
        </div>

        {/* Reverse Geocoding */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Reverse Geocode Coordinates</h2>
          <input
            type="text"
            value={reverseAddress}
            onChange={(e) => setReverseAddress(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Lat,Lon (e.g., 28.7041,77.1025)"
          />
          <button
            onClick={handleReverseGeocode}
            className="mt-4 w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Reverse Geocode
          </button>
        </div>

        {/* Route Optimization */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Route Optimization</h2>
          <textarea
            value={destinations}
            onChange={(e) => setDestinations(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Destinations (Lat,Lon) separated by ;"
          />
          <button
            onClick={handleOptimizeRoute}
            className="mt-4 w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Optimize Routes
          </button>
          {optimizedRoute && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <pre className="text-gray-700">{JSON.stringify(optimizedRoute, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Device Location */}
        <div className="p-4">
      <h1>Get User Location with Google API</h1>
      <p>
        {location && `Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
      </p>
      
    </div>
      </div>
    </div>
  );
};

export default RoutePage;
