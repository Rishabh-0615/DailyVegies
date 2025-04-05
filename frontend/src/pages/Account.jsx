import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Account = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get("/api/user/me");
      setUser(data);
      setLocation(data.location || "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load user details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = { ...user, location };
      await axios.put("/api/user/updateProfile", updatedUser);
      toast.success("Profile updated successfully!");
      setUser({ ...user, location });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-semibold">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Account Details
      </h1>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-gray-50">
          <span className="text-gray-600 font-semibold">Email</span>
          <span className="text-gray-800">{user.email || "N/A"}</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={user.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile</label>
          <input
            type="text"
            value={user.mobile || ""}
            onChange={(e) => setUser({ ...user, mobile: e.target.value })}
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your address"
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          className="w-full mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Account;
