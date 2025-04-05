import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Calendar, 
  MapPin, 
  Truck, 
  IndianRupee,
  User, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Loader,
  Filter,
  Search,
  ShoppingCart,
  Leaf,
  DollarSign,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showIncomeDetails, setShowIncomeDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/user/farmer/orders', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'pending': <Clock className="w-5 h-5 text-yellow-500" />,
      'processing': <Truck className="w-5 h-5 text-blue-500" />,
      'delivered': <CheckCircle className="w-5 h-5 text-green-500" />,
      'cancelled': <AlertCircle className="w-5 h-5 text-red-500" />
    };
    return statusIcons[status.toLowerCase()] || <Package className="w-5 h-5 text-gray-500" />;
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'processing': 'bg-blue-50 text-blue-700 border-blue-200',
      'delivered': 'bg-green-50 text-green-700 border-green-200',
      'cancelled': 'bg-red-50 text-red-700 border-red-200'
    };
    return `${statusClasses[status.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200'} 
            px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1`;
  };

  const calculateTotalIncome = (orders) => {
    return orders.reduce((total, order) => {
      const orderTotal = order.cartItems.reduce((itemTotal, item) => {
        return itemTotal + (item.quantity * item.productId.price);
      }, 0);
      return total + orderTotal;
    }, 0);
  };

  const calculateIncomeByStatus = (orders) => {
    return orders.reduce((acc, order) => {
      const orderTotal = order.cartItems.reduce((itemTotal, item) => {
        return itemTotal + (item.quantity * item.productId.price);
      }, 0);
      
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + orderTotal;
      return acc;
    }, {});
  };

  const calculateTotalQuantityByProduct = (orders) => {
    const quantityByProduct = {};
    orders.forEach(order => {
      order.cartItems.forEach(item => {
        if (!quantityByProduct[item.productId.name]) {
          quantityByProduct[item.productId.name] = 0;
        }
        quantityByProduct[item.productId.name] += item.quantity;
      });
    });
    return quantityByProduct;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.consumerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.orderStatus.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const totalIncome = calculateTotalIncome(filteredOrders);
  const incomeByStatus = calculateIncomeByStatus(filteredOrders);
  const totalQuantityByProduct = calculateTotalQuantityByProduct(filteredOrders);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-green-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-7 h-7 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">My Farm Orders</h1>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{order.consumerId.name || 'Consumer Name'}</span>
                  </div>
                </div>
                <div className={getStatusBadgeClass(order.orderStatus)}>
                  {getStatusIcon(order.orderStatus)}
                  <span>{order.orderStatus}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Delivery Address</div>
                    <div className="text-sm text-gray-600">{order.deliveryAddress}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-600 mb-3">Order Items</div>
                  <div className="space-y-3">
                    {order.cartItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{item.productId.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                            <ShoppingCart className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Qty: {item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1 min-w-[80px]">
                            <IndianRupee className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">{item.productId.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Total Quantity Summary</h2>
        <table className="min-w-full bg-green-50 border rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-gray-700 font-medium">Product Name</th>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">Total Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(totalQuantityByProduct).map(([productName, totalQuantity]) => (
              <tr key={productName} className="border-b hover:bg-green-100">
                <td className="px-4 py-2 text-gray-700 font-medium">{productName}</td>
                <td className="px-4 py-2 text-gray-700">{totalQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowIncomeDetails(!showIncomeDetails)}
        >
          <div className="flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Total Income Summary</h2>
          </div>
          {showIncomeDetails ? 
            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
            <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </div>

        <div className={`mt-4 transition-all duration-300 ${showIncomeDetails ? 'block' : 'hidden'}`}>
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium text-gray-700">Total Earnings</span>
              <div className="flex items-center gap-1 text-xl font-bold text-green-700">
                <IndianRupee className="w-5 h-5" />
                {totalIncome.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(incomeByStatus).map(([status, amount]) => (
              <div key={status} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(status)}
                  <span className="text-sm font-medium capitalize">{status}</span>
                </div>
                <div className="flex items-center gap-1 text-lg font-bold text-gray-700">
                  <IndianRupee className="w-4 h-4" />
                  {amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerOrders;
