import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { 
  Truck, 
  CheckCircle, 
  UserCheck, 
  LogOut, 
  SunDim,
  AlertCircle 
} from 'lucide-react';

const VerifyDelivery = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        console.log("Fetching delivery personnel...");
        const res = await axios.get("/api/admin/verify-delivery", { withCredentials: true });
        setDeliveryPersons(res.data.delivery);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            toast.error("Unauthorized access");
            navigate("/admin-login");
          } else if (err.response.status === 403) {
            toast.error("Access denied. Redirecting...");
            navigate("/admin-login");
          } else {
            setError("Failed to load delivery personnel.");
          }
        } else {
          setError("Failed to connect to server.");
        }
        console.error("Error fetching delivery personnel:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryPersons();
  }, [navigate]);

  const verifyDeliveryPerson = async (deliveryId) => {
    try {
      await axios.put(`/api/admin/verify-delivery/${deliveryId}`, {}, { withCredentials: true });
      setDeliveryPersons(deliveryPersons.filter((person) => person._id !== deliveryId));
      toast.success("Delivery personnel approved successfully.");
    } catch (err) {
      console.error("Error verifying delivery personnel:", err);
      toast.error("Failed to verify delivery personnel.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-blue-50">
      <div className="flex items-center space-x-2">
        <Truck className="animate-bounce text-blue-600" size={40} />
        <span className="text-xl font-semibold text-blue-800">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <div className="flex items-center space-x-2">
        <AlertCircle className="text-red-600" size={40} />
        <span className="text-xl font-semibold text-red-800">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Truck size={40} className="text-white" />
            <h1 className="text-2xl font-bold">Delivery Verification Dashboard</h1>
          </div>
        </div>

        <div className="p-6">
          {deliveryPersons.length === 0 ? (
            <div className="text-center py-10 bg-blue-50 rounded-lg">
              <SunDim size={60} className="mx-auto text-blue-600 mb-4" />
              <p className="text-xl text-blue-800 font-semibold">
                No delivery personnel waiting for approval
              </p>
              <p className="text-blue-700 mt-2">
                All delivery personnel are verified or no new applications exist
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6 space-x-2">
                <UserCheck size={30} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-800">
                  Delivery Personnel Awaiting Verification
                </h2>
              </div>
              <div className="space-y-4">
                {deliveryPersons.map((person) => (
                  <div 
                    key={person._id} 
                    className="bg-blue-100 p-4 rounded-lg flex justify-between items-center hover:bg-blue-200 transition"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">{person.name}</h3>
                      <p className="text-blue-700">{person.email}</p>
                    </div>
                    <button
                      onClick={() => verifyDeliveryPerson(person._id)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <CheckCircle size={20} />
                      <span>Approve Delivery</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyDelivery;
