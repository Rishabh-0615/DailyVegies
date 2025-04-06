import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
  Truck, Package, CheckCircle, XCircle, MapPin, Navigation, Send, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import {
  GoogleMap, LoadScript, DirectionsRenderer, Marker
} from '@react-google-maps/api';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const Deliveryboy = () => {
  const { token } = useParams();
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState({});
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

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
      toast.error("Missing location data.");
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
      toast.error("Failed to calculate route.");
    }
  };

  // Send OTP for delivery confirmation
  const sendDeliveryOtp = async (orderId) => {
    try {
      setSendingOtp(true);
      const response = await axios.post('/api/user/delivery/send-otp', {
        orderId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setOtpSent(prev => ({ ...prev, [orderId]: true }));
        setShowOtpField(orderId);
        toast.success("OTP sent successfully to customer. Ask them to check their email.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending delivery OTP:", error);
      toast.error("Error sending OTP: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setSendingOtp(false);
    }
  };

  // Confirm delivery with OTP
  const confirmDelivery = async (orderId) => {
    if (!otp) {
      toast.success("Please enter the OTP provided by the customer.");
      return;
    }
    
    try {
      setVerifyingOtp(true);
      const response = await axios.post('/api/user/delivery/confirm', {
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
        setOtpSent(prev => {
          const newState = { ...prev };
          delete newState[orderId];
          return newState;
        });
        toast.success("Delivery confirmed successfully!");
      } else {
        toast.error("Invalid OTP! Please try again.");
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      toast.error("Failed to confirm delivery: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-80">
      {/* Animated background removed */}

      <div className="relative z-10 p-6">
        <motion.div 
          className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-3xl font-bold text-green-800 mb-4 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Truck className="mr-2" /> Delivery Dashboard
          </motion.h1>

          {/* <motion.div 
            className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div>Token: {token ? token.substring(0, 10) + '...' : 'Not available'}</div>
            <div>Orders count: {assignedOrders.length}</div>
            <div>Loading state: {loading ? 'Loading...' : 'Completed'}</div>
            {error && <div className="text-red-500">Error: {error}</div>}
          </motion.div> */}

          {currentLocation && (
            <motion.div 
              className="border rounded-lg overflow-hidden mb-6 h-64"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
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
            </motion.div>
          )}

          <motion.div 
            className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg border border-green-200 rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <Package className="mr-2 text-green-700" />
              <h2 className="text-xl font-semibold text-green-800">Assigned Orders</h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-green-700">Loading orders...</p>
              </div>
            ) : assignedOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders assigned yet.</p>
            ) : (
              <div className="overflow-x-auto">
                {/* Fixed table structure with consistent column widths */}
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-green-200">
                      <th className="py-2 text-left text-green-800 w-1/6">Order ID</th>
                      <th className="py-2 text-left text-green-800 w-1/6">Customer</th>
                      <th className="py-2 text-left text-green-800 w-2/6">Delivery Address</th>
                      <th className="py-2 text-left text-green-800 w-1/6">Total Price</th>
                      <th className="py-2 text-left text-green-800 w-1/6">Status</th>
                      <th className="py-2 text-left text-green-800 w-1/6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedOrders.map((order, index) => (
                      <motion.tr 
                        key={order._id} 
                        className="border-b border-green-100 hover:bg-green-50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <td className="py-3 w-1/6">{order._id.substring(0, 8)}...</td>
                        <td className="py-3 w-1/6">{order.userId?.name || 'N/A'}</td>
                        <td className="py-3 w-2/6">
                          <div className="flex items-center">
                            <MapPin className="mr-2 text-green-600 flex-shrink-0" />
                            <span className="truncate">{order.location?.address || 'N/A'}</span>
                          </div>
                          {order.location?.coordinates && (
                            <div className="mt-1 flex flex-wrap gap-2">
                              <motion.button
                                onClick={() => calculateRoute(order.location)}
                                className="text-green-600 hover:text-green-800 flex items-center text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Navigation size={16} className="mr-1" /> Show Route
                              </motion.button>
                              <motion.button
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
                                className="text-green-700 hover:text-green-900 flex items-center text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Navigation size={16} className="mr-1" /> Open in Maps
                              </motion.button>
                            </div>
                          )}
                        </td>
                        <td className="py-3 w-1/6">
                          ₹{order.totalPrice?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-3 w-1/6">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.deliveryStatus === "DELIVERED" ? "bg-green-100 text-green-800" : 
                            order.deliveryStatus === "SHIPPING" ? "bg-blue-100 text-blue-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.deliveryStatus || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3 w-1/6">
                          {order.deliveryStatus !== "DELIVERED" ? (
                            !otpSent[order._id] ? (
                              <motion.button
                                onClick={() => sendDeliveryOtp(order._id)}
                                disabled={sendingOtp}
                                className="bg-green-600 text-white px-3 py-2 rounded-md flex items-center shadow-md hover:bg-green-700 transition duration-300 w-full justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Send className="mr-1" size={16} /> 
                                {sendingOtp ? "Sending..." : "Send OTP"}
                              </motion.button>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center text-amber-600">
                                  <AlertCircle size={16} className="mr-1" />
                                  <span className="text-xs">OTP sent to customer</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <motion.input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="border border-green-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                                    whileHover={{ scale: 1.02 }}
                                  />
                                  <motion.button
                                    onClick={() => confirmDelivery(order._id)}
                                    disabled={verifyingOtp}
                                    className="bg-green-600 text-white px-3 py-2 rounded-md flex items-center shadow-md hover:bg-green-700 transition duration-300 whitespace-nowrap"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <CheckCircle className="mr-1" size={16} />
                                    {verifyingOtp ? "Verifying..." : "Confirm"}
                                  </motion.button>
                                </div>
                              </div>
                            )
                          ) : (
                            <span className="text-green-500 flex items-center">
                              <CheckCircle className="mr-1" size={16} />
                              Delivered
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Deliveryboy;