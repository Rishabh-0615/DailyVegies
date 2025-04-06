// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import LocationAutocomplete from '../components/LocationAutocomplete';

// export default function MyFarmCrops() {
//   const [crops, setCrops] = useState([]);
//   const [formData, setFormData] = useState({
//     cropName: '',
//     sowingDate: '',
//     harvestDate: '',
//     location: { address: '', lat: '', lon: '' }
//   });

//   const fetchCrops = async () => {
//     try {
//       const response = await axios.get('/api/farm-crops/my-crops');
//       setCrops(response.data);
//     } catch (error) {
//       console.error('Error fetching crops:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCrops();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleLocationSelect = (location) => {
//     setFormData({
//       ...formData,
//       location
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/farm-crops/add', {
//         cropName: formData.cropName,
//         sowingDate: formData.sowingDate,
//         expectedHarvest: formData.harvestDate,
//         location: {
//           lat: formData.location.lat,
//           lon: formData.location.lon
//         },
//         address: formData.location.address
//       });
//       fetchCrops();
//       setFormData({
//         cropName: '',
//         sowingDate: '',
//         harvestDate: '',
//         location: { address: '', lat: '', lon: '' }
//       });
//     } catch (error) {
//       console.error('Error adding crop:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">My Crops</h1>
      
//       <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
//         <div className="mb-4">
//           <label className="block mb-2">Crop Name</label>
//           <input
//             type="text"
//             name="cropName"
//             value={formData.cropName}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
        
//         <div className="mb-4">
//           <label className="block mb-2">Sowing Date</label>
//           <input
//             type="date"
//             name="sowingDate"
//             value={formData.sowingDate}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
        
//         <div className="mb-4">
//           <label className="block mb-2">Harvest Date</label>
//           <input
//             type="date"
//             name="harvestDate"
//             value={formData.harvestDate}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
        
//         <div className="mb-4">
//           <label className="block mb-2">Location</label>
//           <LocationAutocomplete onLocationSelect={handleLocationSelect} />
//           {formData.location.address && (
//             <p className="mt-2 text-sm">Selected: {formData.location.address}</p>
//           )}
//         </div>
        
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Add Crop
//         </button>
//       </form>
      
//       <div>
//         <h2 className="text-xl font-bold mb-4">Your Crops</h2>
//         {crops.length === 0 ? (
//           <p>No crops found</p>
//         ) : (
//           <div className="grid gap-4">
//             {crops.map(crop => (
//               <div key={crop._id} className="p-4 border rounded">
//                 <h3 className="font-bold">{crop.cropName}</h3>
//                 <p>Sowing: {new Date(crop.sowingDate).toLocaleDateString()}</p>
//                 <p>Harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}</p>
//                 <p>Location: {crop.address}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationAutocomplete from '../components/LocationAutocomplete';
//import '../styles/weather.css'

const CropCard = ({ crop }) => {
  const [showForecast, setShowForecast] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (showForecast) {
      setShowForecast(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/weather/forecast?lat=${crop.location.lat}&lon=${crop.location.lon}`);
      setForecast(response.data);
      setShowForecast(true);
    } catch (error) {
      setError('Failed to load weather data');
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-green-700">{crop.cropName}</h3>
          <p className="text-gray-700"><span className="font-medium">Sowing:</span> {new Date(crop.sowingDate).toLocaleDateString()}</p>
          <p className="text-gray-700"><span className="font-medium">Harvest:</span> {new Date(crop.expectedHarvest).toLocaleDateString()}</p>
          <p className="text-gray-700"><span className="font-medium">Location:</span> {crop.address}</p>
        </div>
        <button
          onClick={fetchWeather}
          className={`px-4 py-2 rounded-full text-sm ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-medium transition-colors shadow-sm`}
          disabled={loading}
        >
          {loading ? 'Loading...' : showForecast ? 'Hide Forecast' : 'Show Forecast'}
        </button>
      </div>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">{error}</div>
      )}

      {showForecast && forecast && (
        <div className="mt-4 bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold mb-2 text-green-800">
            Weather Forecast for {forecast.city.name}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {forecast.list.filter((_, index) => index % 8 === 0).slice(0, 7).map((day, index) => (
              <div key={index} className="p-3 border rounded-lg bg-white hover:bg-green-50 transition-colors shadow-sm">
                <p className="font-medium text-center text-green-700">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                  alt={day.weather[0].main}
                  className="w-12 h-12 mx-auto"
                />
                <p className="text-center text-gray-700">Temp: {Math.round(day.main.temp)}°C</p>
                <p className="text-center text-gray-700">Humidity: {day.main.humidity}%</p>
                <p className="capitalize text-center text-gray-700 text-sm">{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function MyFarmCrops() {
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    cropName: '',
    sowingDate: '',
    harvestDate: '',
    location: { address: '', lat: '', lon: '' }
  });

  const fetchCrops = async () => {
    try {
      const response = await axios.get('/api/farm-crops/my-crops');
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      location
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/farm-crops/add', {
        cropName: formData.cropName,
        sowingDate: formData.sowingDate,
        expectedHarvest: formData.harvestDate,
        location: {
          lat: formData.location.lat,
          lon: formData.location.lon
        },
        address: formData.location.address
      });
      fetchCrops();
      setFormData({
        cropName: '',
        sowingDate: '',
        harvestDate: '',
        location: { address: '', lat: '', lon: '' }
      });
    } catch (error) {
      console.error('Error adding crop:', error);
    }
  };

  return (
    <div className="min-h-screen bg-green-100">
      

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        
        <h2 className="text-2xl font-bold mb-6 text-green-800">My Farm Crops</h2>
        
        <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Add New Crop</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Crop Name</label>
              <input
                type="text"
                name="cropName"
                value={formData.cropName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500"
                required
                placeholder="Enter crop name"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">Sowing Date</label>
              <input
                type="date"
                name="sowingDate"
                value={formData.sowingDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">Harvest Date</label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">Location</label>
              <LocationAutocomplete onLocationSelect={handleLocationSelect} />
              {formData.location.address && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {formData.location.address}
                </p>
              )}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Crop
          </button>
        </form>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Your Crops</h2>
          {crops.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-gray-500">No crops registered yet. Add your first crop above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {crops.map(crop => (
                <CropCard key={crop._id} crop={crop} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <footer className="bg-green-700 text-white mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-lg">DailyVegies</h3>
              <p className="text-green-200">Supporting sustainable farming since 2023</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-200 transition-colors">About</a>
              <a href="#" className="hover:text-green-200 transition-colors">Contact</a>
              <a href="#" className="hover:text-green-200 transition-colors">Terms</a>
              <a href="#" className="hover:text-green-200 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}