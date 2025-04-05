import React, { useState, useEffect } from 'react';
import {
  Truck, Package, CheckCircle, XCircle, MapPin,
  DollarSign, Navigation, List, Map as MapIcon
} from 'lucide-react';
import axios from 'axios';
import {
  GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker
} from '@react-google-maps/api';

const DeliveryBoyDashboard = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [directions, setDirections] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => console.error('Error getting location:', error)
    );

    const fetchAssignedOrders = async () => {
      try {
        const response = await axios.get('/api/new/assigned-orders');
        setAssignedOrders(response.data);
      } catch (error) {
        console.error('Error fetching assigned orders', error);
      }
    };

    fetchAssignedOrders();

    // Real-time location tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const calculateRoute = async (destination) => {
    if (!currentLocation) return;

    const directionsService = new google.maps.DirectionsService();
    const result = await directionsService.route({
      origin: new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
      destination: new google.maps.LatLng(destination.coordinates[1], destination.coordinates[0]),
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirections(result);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put('/api/new/update-order-status', { orderId, status });
      const response = await axios.get('/api/new/assigned-orders');
      setAssignedOrders(response.data);
    } catch (error) {
      console.error('Error updating order status', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <Truck className="mr-2" /> Delivery Dashboard
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <List />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded ${viewMode === 'map' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <MapIcon />
          </button>
        </div>
      </div>

      {viewMode === 'map' && (
        <LoadScript googleMapsApiKey="AIzaSyBp2vxnypb_RIEbySnqcRaGZUMthm5n490">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={currentLocation}
            zoom={13}
          >
            {currentLocation && <Marker position={currentLocation} />}
            {selectedOrder && directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: {
                    strokeColor: "#2563eb",
                    strokeWeight: 5
                  }
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      )}

      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Package className="mr-2" />
          <h2 className="text-xl font-semibold">Assigned Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Order ID</th>
                <th className="py-2 text-left">Delivery Address</th>
                <th className="py-2 text-left">Total Price</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedOrders.map(assignment => {
                const order = assignment.orderId;
                return (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{order._id}</td>
                    <td className="py-2 flex items-center">
                      <MapPin className="mr-2 text-gray-500" />
                      {order.location.address}
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          calculateRoute(order.location);
                        }}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <Navigation size={16} />
                      </button>
                    </td>
                    <td className="py-2 flex items-center">
                      <DollarSign className="mr-1 text-green-500" />
                      {order.totalPrice}
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        order.deliveryStatus === 'OUT_FOR_DELIVERY' ? 'bg-blue-100 text-blue-800' :
                        order.deliveryStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.deliveryStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.deliveryStatus}
                      </span>
                    </td>
                    <td className="py-2 space-x-2">
                      <button
                        onClick={() => updateOrderStatus(order._id, 'OUT_FOR_DELIVERY')}
                        className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
                        disabled={order.deliveryStatus === 'DELIVERED' || order.deliveryStatus === 'CANCELLED'}
                      >
                        <Truck className="mr-1" /> Start
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id, 'DELIVERED')}
                        className="bg-green-500 text-white px-3 py-1 rounded flex items-center"
                        disabled={order.deliveryStatus !== 'OUT_FOR_DELIVERY'}
                      >
                        <CheckCircle className="mr-1" /> Deliver
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id, 'CANCELLED')}
                        className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
                        disabled={order.deliveryStatus === 'DELIVERED'}
                      >
                        <XCircle className="mr-1" /> Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
