import React, { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, Truck, Package, Search, User, MapPin, RefreshCw, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const [city, setCity] = useState("");
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedBoy, setSelectedBoy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders by city
  const fetchOrders = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/admin/ordersByCity", { city });
      setOrders(response.data.orders || []);
      if (response.data.orders?.length === 0) {
        setError(`No orders found for ${city}`);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch delivery boys by city
  const fetchDeliveryBoys = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/admin/boysByCity", { city });
      setDeliveryBoys(response.data || []);
      if (response.data.length === 0) {
        setError(`No delivery personnel found in ${city}`);
      }
    } catch (error) {
      console.error("Error fetching delivery boys:", error);
      setError(error.response?.data?.message || "Failed to fetch delivery personnel");
    } finally {
      setLoading(false);
    }
  };

  // Assign a delivery boy to an order
  const assignDeliveryBoy = async () => {
    if (!selectedOrder || !selectedBoy) {
      setError("Please select both an order and delivery personnel");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await axios.put("/api/admin/assign-delivery", {
        orderId: selectedOrder,
        deliveryBoyId: selectedBoy,
      });
      fetchOrders(); // Refresh orders
      setError(null);
      alert("Delivery personnel assigned successfully");
    } catch (error) {
      console.error("Error assigning delivery boy:", error);
      setError(error.response?.data?.message || "Failed to assign delivery personnel");
    } finally {
      setLoading(false);
    }
  };

  // Logout admin
  const logoutAdmin = async () => {
    try {
      await axios.post("/api/admin/logoutAdmin");
      alert("Logged out successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fetch data when city changes
  useEffect(() => {
    if (city.trim()) {
      fetchOrders();
      fetchDeliveryBoys();
    }
  }, [city]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "text-yellow-500";
      case "OUT_FOR_DELIVERY": return "text-blue-500";
      case "DELIVERED": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
     

      {/* City search section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          <MapPin size={20} className="text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold">Location Filter</h2>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchOrders()}
            />
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button 
            onClick={() => {
              fetchOrders();
              fetchDeliveryBoys();
            }}
            disabled={loading || !city.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:bg-blue-300"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
            Search
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Package size={20} className="text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">Orders ({orders.length})</h2>
          </div>
          
          {orders.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {orders.map((order) => (
                <div 
                  key={order._id} 
                  onClick={() => setSelectedOrder(order._id)}
                  className={`p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer transition-colors ${
                    selectedOrder === order._id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium truncate">{order.userId?.name || "Customer"}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus)}`}>
                      {order.deliveryStatus || "PENDING"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Order ID: {order._id}</div>
                  <div className="text-sm text-gray-500">
                    Items: {order.cartItems?.length || 0} | 
                    Total: ${order.cartItems?.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-500">
              {city ? "No orders found for this city" : "Enter a city to view orders"}
            </div>
          )}
        </div>

        {/* Delivery Boys section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Truck size={20} className="text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">Delivery Personnel ({deliveryBoys.length})</h2>
          </div>
          
          {deliveryBoys.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {deliveryBoys.map((boy) => (
                <div 
                  key={boy._id} 
                  onClick={() => setSelectedBoy(boy._id)}
                  className={`p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer transition-colors ${
                    selectedBoy === boy._id ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <User size={18} className="text-gray-400 mr-2" />
                    <div>
                      <div className="font-medium">{boy.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {boy.location}
                      </div>
                      {boy.phone && <div className="text-sm text-gray-500">{boy.phone}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-500">
              {city ? "No delivery personnel found for this city" : "Enter a city to view delivery personnel"}
            </div>
          )}
        </div>
      </div>
      
      {/* Assignment section */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Assign Delivery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-medium mb-2">Selected Order:</h3>
            <div className="p-3 bg-gray-100 rounded-lg min-h-12">
              {selectedOrder ? (
                <div>
                  {orders.find(o => o._id === selectedOrder)?.userId?.name || "Unknown Customer"} - 
                  Order ID: {selectedOrder}
                </div>
              ) : (
                <div className="text-gray-500">No order selected</div>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Selected Delivery Personnel:</h3>
            <div className="p-3 bg-gray-100 rounded-lg min-h-12">
              {selectedBoy ? (
                <div>
                  {deliveryBoys.find(b => b._id === selectedBoy)?.name || "Unknown"} - 
                  {deliveryBoys.find(b => b._id === selectedBoy)?.location}
                </div>
              ) : (
                <div className="text-gray-500">No delivery personnel selected</div>
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={assignDeliveryBoy}
          disabled={loading || !selectedBoy || !selectedOrder}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 transition-colors disabled:bg-green-300"
        >
          {loading ? <RefreshCw size={18} className="animate-spin" /> : <Truck size={18} />}
          Assign Delivery Personnel
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;