import React, { useState, useEffect } from 'react';
import {
  Truck, Package, CheckCircle, XCircle, MapPin,
  DollarSign, Navigation
} from 'lucide-react';
import axios from 'axios';
import {
  GoogleMap, LoadScript, DirectionsRenderer, Marker
} from '@react-google-maps/api';
import { useParams } from 'react-router-dom';

const Deliveryboy = () => {
  const { token } = useParams();
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assigned orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/admin/get-personal-orders`);
        if (response.data && Array.isArray(response.data.assignedOrders)) {
          setAssignedOrders(response.data.assignedOrders);
        } else {
          console.warn("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching assigned orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Error getting location:', error.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    }
  }, []);

  // Calculate route (if you want to visualize on map)
  const calculateRoute = async (destination) => {
    if (!currentLocation || !destination?.coordinates) {
      alert("Missing location data.");
      return;
    }

    if (typeof google === 'undefined') {
      console.error('Google Maps API not loaded');
      return;
    }

    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
        destination: new google.maps.LatLng(destination.coordinates[1], destination.coordinates[0]),
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirections(result);
    } catch (error) {
      console.error("Error calculating route:", error);
      alert("Failed to calculate route.");
    }
  };

  // Confirm delivery
  const confirmDelivery = async (orderId) => {
    try {
      const response = await axios.post(`/api/delivery/confirm`, {
        orderId,
        otp,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setAssignedOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, deliveryStatus: "DELIVERED" } : order
          )
        );
        setShowOtpField(null);
        setOtp("");
      } else {
        alert("Invalid OTP! Please try again.");
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      alert("Failed to confirm delivery.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold flex items-center">
        <Truck className="mr-2" /> Delivery Dashboard
      </h1>

      <div className="bg-gray-100 p-4 rounded mb-4 text-sm">
        <div>Token: {token ? token.substring(0, 10) + '...' : 'Not available'}</div>
        <div>Orders count: {assignedOrders.length}</div>
        <div>Loading state: {loading ? 'Loading...' : 'Completed'}</div>
        {error && <div className="text-red-500">Error: {error}</div>}
      </div>

      {currentLocation && (
        <div className="border rounded-lg p-4 h-64 mb-4">
          <LoadScript googleMapsApiKey="AIzaSyBp2vxnypb_RIEbySnqcRaGZUMthm5n490">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={currentLocation}
              zoom={13}
            >
              <Marker position={currentLocation} />
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </LoadScript>
        </div>
      )}

      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Package className="mr-2" />
          <h2 className="text-xl font-semibold">Assigned Orders</h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Loading orders...</p>
          </div>
        ) : assignedOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No orders assigned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Order ID</th>
                  <th className="py-2 text-left">Customer</th>
                  <th className="py-2 text-left">Delivery Address</th>
                  <th className="py-2 text-left">Total Price</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedOrders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{order._id.substring(0, 8)}...</td>
                    <td className="py-2">{order.userId?.name || 'N/A'}</td>
                    <td className="py-2 flex items-center">
                      <MapPin className="mr-2 text-gray-500" />
                      {order.location?.address || 'N/A'}
                      {order.location?.coordinates && (
                        <>
                          <button
                            onClick={() => calculateRoute(order.location)}
                            className="ml-2 text-indigo-500 hover:text-indigo-700 flex items-center"
                          >
                            <Navigation size={16} className="mr-1" /> Show Route
                          </button>
                          <button
                            onClick={() => {
                              if (currentLocation && order.location?.coordinates) {
                                const origin = `${currentLocation.lat},${currentLocation.lng}`;
                                const destination = `${order.location.coordinates[1]},${order.location.coordinates[0]}`;
                                const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
                                window.location.href = url;
                              } else {
                                alert('Location information is missing!');
                              }
                            }}
                            className="ml-2 text-green-600 hover:text-green-800 flex items-center"
                          >
                            <Navigation size={16} className="mr-1" /> Open in Maps
                          </button>
                        </>
                      )}
                    </td>
                    <td className="py-2 flex items-center">
                      <DollarSign className="mr-1 text-green-500" />
                      ₹{order.totalPrice?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-2">{order.deliveryStatus || 'UNKNOWN'}</td>
                    <td className="py-2 space-x-2">
                      <button
                        onClick={() => setShowOtpField(order._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded flex items-center"
                      >
                        <CheckCircle className="mr-1" /> Deliver
                      </button>
                      {showOtpField === order._id && (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="border px-2 py-1 rounded mr-2"
                          />
                          <button
                            onClick={() => confirmDelivery(order._id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Confirm
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deliveryboy;
