import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Package, 
  Truck, 
  Users, 
  MapPin, 
  Search, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Filter,
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const AssignedDeliveries = () => {
  const [city, setCity] = useState("");
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch assigned deliveries by city
  const fetchAssignedDeliveries = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/admin/assignedDeliveriesByCity", { city });
      let orders = response.data.assignedOrders || [];
      
      // Apply status filter
      if (statusFilter !== "all") {
        orders = orders.filter(order => {
          if (statusFilter === "pending") return order.deliveryStatus === "PENDING";
          if (statusFilter === "inProgress") return order.deliveryStatus === "OUT_FOR_DELIVERY";
          if (statusFilter === "delivered") return order.deliveryStatus === "DELIVERED";
          if (statusFilter === "canceled") return order.deliveryStatus === "CANCELED";
          return true;
        });
      }
      
      // Apply sorting
      orders = sortOrders(orders, sortBy, sortOrder);
      
      setAssignedOrders(orders);
      
      if (orders.length === 0) {
        setError(`No assigned deliveries found for ${city} with the current filters`);
      }
    } catch (error) {
      console.error("Error fetching assigned deliveries:", error);
      setError(error.response?.data?.message || "Failed to fetch assigned deliveries");
    } finally {
      setLoading(false);
    }
  };

  // Fetch delivery statistics
  const fetchDeliveryStats = async () => {
    if (!city.trim()) return;
    
    setStatsLoading(true);
    
    try {
      const response = await axios.post("/api/admin/deliveryStatsByCity", { city });
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching delivery stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Update delivery status
  const updateDeliveryStatus = async (orderId, newStatus) => {
    try {
      await axios.put("/api/admin/updateDeliveryStatus", {
        orderId,
        status: newStatus,
      });
      
      // Refresh the order list
      fetchAssignedDeliveries();
      fetchDeliveryStats();
      
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  // Sort orders
  const sortOrders = (orders, sortField, order) => {
    return [...orders].sort((a, b) => {
      if (sortField === "date") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortField === "status") {
        const statusOrder = { PENDING: 1, OUT_FOR_DELIVERY: 2, DELIVERED: 3, CANCELED: 4 };
        return order === "asc" 
          ? statusOrder[a.deliveryStatus] - statusOrder[b.deliveryStatus]
          : statusOrder[b.deliveryStatus] - statusOrder[a.deliveryStatus];
      }
      return 0;
    });
  };

  // Calculate total price of an order
  const calculateTotal = (cartItems) => {
    return cartItems.reduce(
      (sum, item) => sum + (item.productId?.price || 0) * item.quantity, 
      0
    ).toFixed(2);
  };

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "OUT_FOR_DELIVERY": return "bg-blue-100 text-blue-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING": return <Clock size={16} />;
      case "OUT_FOR_DELIVERY": return <Truck size={16} />;
      case "DELIVERED": return <CheckCircle size={16} />;
      case "CANCELED": return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  // Fetch data when city changes
  useEffect(() => {
    if (city.trim()) {
      fetchAssignedDeliveries();
      fetchDeliveryStats();
    }
  }, [city, statusFilter, sortBy, sortOrder]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Assigned Deliveries</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              fetchAssignedDeliveries();
              fetchDeliveryStats();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

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
              onKeyPress={(e) => e.key === 'Enter' && fetchAssignedDeliveries()}
            />
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button 
            onClick={fetchAssignedDeliveries}
            disabled={loading || !city.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:bg-blue-300"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
            Search
          </button>
        </div>
      </div>

      {/* Stats section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-blue-600">Total Assigned</div>
              <Package size={20} className="text-blue-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.totalAssigned}</div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-yellow-600">Pending</div>
              <Clock size={20} className="text-yellow-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.pending}</div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-indigo-600">In Progress</div>
              <Truck size={20} className="text-indigo-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.inProgress}</div>
          </div>
          
          <div className="bg-green-50 border border-green-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-green-600">Delivered</div>
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.delivered}</div>
          </div>
          
          <div className="bg-red-50 border border-red-100 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-red-600">Canceled</div>
              <XCircle size={20} className="text-red-500" />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.canceled}</div>
          </div>
        </div>
      )}

      {/* Filters section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Filter size={20} className="text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">Filters & Sorting</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
            <select
              className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="inProgress">Out For Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="flex gap-2">
              <button
                className={`flex-1 p-2 rounded-lg border ${
                  sortBy === "date" ? "bg-blue-50 border-blue-300" : "border-gray-300"
                }`}
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center justify-center gap-1">
                  <Calendar size={16} />
                  <span>Date</span>
                  {sortBy === "date" && (
                    sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </button>
              
              <button
                className={`flex-1 p-2 rounded-lg border ${
                  sortBy === "status" ? "bg-blue-50 border-blue-300" : "border-gray-300"
                }`}
                onClick={() => toggleSort("status")}
              >
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp size={16} />
                  <span>Status</span>
                  {sortBy === "status" && (
                    sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <Package size={20} className="text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold">Assigned Orders ({assignedOrders.length})</h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        
        {assignedOrders.length > 0 ? (
          <div className="space-y-4">
            {assignedOrders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Order header */}
                <div 
                  className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-gray-500" />
                    <span className="font-medium">
                      Order #{order._id.substring(order._id.length - 8)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.deliveryStatus)}`}>
                      {getStatusIcon(order.deliveryStatus)}
                      {order.deliveryStatus}
                    </span>
                    {expandedOrder === order._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
                
                {/* Order details */}
                {expandedOrder === order._id && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Customer info */}
                      <div>
                        <h3 className="font-medium mb-2 flex items-center gap-1">
                          <Users size={16} />
                          Customer Information
                        </h3>
                        <div className="text-sm">
                          <p className="mb-1"><span className="font-medium">Name:</span> {order.userId?.name || "N/A"}</p>
                          <p className="mb-1"><span className="font-medium">Email:</span> {order.userId?.email || "N/A"}</p>
                          <p className="mb-1"><span className="font-medium">Phone:</span> {order.userId?.phone || "N/A"}</p>
                          <p><span className="font-medium">Address:</span> {order.userId?.address || "N/A"}</p>
                        </div>
                      </div>
                      
                      {/* Delivery info */}
                      <div>
                        <h3 className="font-medium mb-2 flex items-center gap-1">
                          <Truck size={16} />
                          Delivery Information
                        </h3>
                        <div className="text-sm">
                          <p className="mb-1">
                            <span className="font-medium">Delivery Person:</span> {order.deliveryBoyId?.name || "N/A"}
                          </p>
                          <p className="mb-1">
                            <span className="font-medium">Contact:</span> {order.deliveryBoyId?.phone || "N/A"}
                          </p>
                          <p className="mb-1">
                            <span className="font-medium">Location:</span> {order.deliveryBoyId?.location || "N/A"}
                          </p>
                          {order.deliveredAt && (
                            <p>
                              <span className="font-medium">Delivered At:</span> {formatDate(order.deliveredAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order items */}
                    <h3 className="font-medium mb-2 flex items-center gap-1">
                      <Package size={16} />
                      Order Items
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {order.cartItems.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{item.productId?.name || "Unknown Product"}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">${item.productId?.price?.toFixed(2) || "0.00"}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">${((item.productId?.price || 0) * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="3" className="px-4 py-2 text-sm font-medium text-right">Total:</td>
                            <td className="px-4 py-2 text-sm font-medium">${calculateTotal(order.cartItems)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    
                    {/* Update status */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <h3 className="w-full font-medium mb-2">Update Status:</h3>
                      <button 
                        onClick={() => updateDeliveryStatus(order._id, "PENDING")}
                        disabled={order.deliveryStatus === "PENDING"}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                      >
                        <Clock size={16} /> Pending
                      </button>
                      <button 
                        onClick={() => updateDeliveryStatus(order._id, "OUT_FOR_DELIVERY")}
                        disabled={order.deliveryStatus === "OUT_FOR_DELIVERY"}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                      >
                        <Truck size={16} /> Out For Delivery
                      </button>
                      <button 
                        onClick={() => updateDeliveryStatus(order._id, "DELIVERED")}
                        disabled={order.deliveryStatus === "DELIVERED"}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                      >
                        <CheckCircle size={16} /> Delivered
                      </button>
                      <button 
                        onClick={() => updateDeliveryStatus(order._id, "CANCELED")}
                        disabled={order.deliveryStatus === "CANCELED"}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                      >
                        <XCircle size={16} /> Canceled
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500">
            {city ? "No assigned deliveries found" : "Enter a city to view assigned deliveries"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedDeliveries;