import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { 
  Leaf, 
  CheckCircle, 
  UserCheck, 
  LogOut, 
  Tractor, 
  SunDim,
  AlertCircle 
} from 'lucide-react';

const VerifyFarmer = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        console.log("Fetching farmers...");
        const res = await axios.get("/api/admin/verify-farmer", { withCredentials: true });
        
        // If the response is successful, set the farmers' data
        setFarmers(res.data.farmers);
      } catch (err) {
        // Handle errors based on the status
        if (err.response) {
          if (err.response.status === 401) {
            toast.error("Unauthorized access");
            navigate("/admin-login");
          } else if (err.response.status === 403) {
            toast.error("Access denied. Redirecting...");
            navigate("/admin-login");
          } else {
            setError("Failed to load farmers.");
          }
        } else {
          setError("Failed to connect to server.");
        }
        console.error("Error fetching farmers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, [navigate]);

  const verifyFarmer = async (farmerId) => {
    try {
      await axios.put(`/api/admin/verify-farmer/${farmerId}`, {}, { withCredentials: true });
      setFarmers(farmers.filter((farmer) => farmer._id !== farmerId));
      toast.success("Farmer approved successfully.");
    } catch (err) {
      console.error("Error verifying farmer:", err);
      toast.error("Failed to verify farmer.");
    }
  };



  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-green-50">
      <div className="flex items-center space-x-2">
        <Tractor className="animate-bounce text-green-600" size={40} />
        <span className="text-xl font-semibold text-green-800">Loading...</span>
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
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Leaf size={40} className="text-white" />
            <h1 className="text-2xl font-bold">Farmer Verification Dashboard</h1>
          </div>
          
        </div>

        {/* Main Content */}
        <div className="p-6">
          {farmers.length === 0 ? (
            <div className="text-center py-10 bg-green-50 rounded-lg">
              <SunDim size={60} className="mx-auto text-green-600 mb-4" />
              <p className="text-xl text-green-800 font-semibold">
                No farmers waiting for approval at the moment
              </p>
              <p className="text-green-700 mt-2">
                All farmers are currently verified or no new applications exist
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6 space-x-2">
                <UserCheck size={30} className="text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">
                  Farmers Awaiting Verification
                </h2>
              </div>
              <div className="space-y-4">
                {farmers.map((farmer) => (
                  <div 
                    key={farmer._id} 
                    className="bg-green-100 p-4 rounded-lg flex justify-between items-center hover:bg-green-200 transition"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">{farmer.name}</h3>
                      <p className="text-green-700">{farmer.email}</p>
                    </div>
                    <button
                      onClick={() => verifyFarmer(farmer._id)}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <CheckCircle size={20} />
                      <span>Approve Farmer</span>
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

export default VerifyFarmer;