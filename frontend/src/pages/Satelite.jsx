import { Satellite, Info, MapPin, Loader } from 'lucide-react'; 
import { useState } from 'react';

function Satelite() {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [ndviImage, setNdviImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const fetchNdvi = async () => {
    if (!lat || !lon) {
      setError('Please enter coordinates.');
      return;
    }

    setLoading(true);
    setError('');
    setNdviImage(null);

    try {
      const response = await fetch('/api/satellite/ndvi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: parseFloat(lat), lon: parseFloat(lon) }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch crop health map.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setNdviImage(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Use browser geolocation if available
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toFixed(4));
          setLon(position.coords.longitude.toFixed(4));
          setLoading(false);
        },
        (err) => {
          setError("Couldn't get your location: " + err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Your browser doesn't support location services");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Satellite className="text-green-600" size={32} />
          <h1 className="text-3xl font-bold text-green-800">Farm Health Scanner</h1>
        </div>

        <div className="bg-green-100 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
              <Info size={20} />
              What is this tool?
            </h2>
            <button 
              onClick={() => setShowHelp(!showHelp)} 
              className="text-green-700 underline"
            >
              {showHelp ? "Hide explanation" : "Show explanation"}
            </button>
          </div>

          {showHelp && (
            <div className="mt-3 text-green-800">
              <p className="mb-2">This tool shows you a satellite image of your farm's health using NDVI (Normalized Difference Vegetation Index).</p>
              <p className="mb-2">NDVI measures how healthy your crops are from space. On the map:</p>
              <ul className="list-disc pl-6 mb-2">
                <li><span className="font-semibold">Bright green/white areas</span>: Very healthy vegetation</li>
                <li><span className="font-semibold">Medium green areas</span>: Moderately healthy vegetation</li>
                <li><span className="font-semibold">Yellow/brown areas</span>: Stressed or unhealthy vegetation</li>
                <li><span className="font-semibold">Red areas</span>: Bare soil or very unhealthy vegetation</li>
              </ul>
              <p>This information helps you identify which parts of your field need attention.</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Enter Your Farm Location</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Set Location:</label>
            <div className="flex gap-3 mb-4">
              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                <input
                  type="number"
                  placeholder="Example: 36.7783"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                <input
                  type="number"
                  placeholder="Example: -119.4179"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={useCurrentLocation}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 justify-center"
              >
                <MapPin size={16} />
                Use My Current Location
              </button>
              
              <button
                onClick={fetchNdvi}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Getting Your Farm Map...
                  </>
                ) : (
                  <>
                    <Satellite size={16} />
                    Check Farm Health
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {ndviImage && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Your Farm Health Map</h2>
            <div className="flex flex-col items-center">
              <img 
                src={ndviImage} 
                alt="Farm Health Map" 
                className="rounded shadow-lg max-w-full" 
              />
              <div className="mt-4 bg-white p-4 rounded-lg border border-gray-300 w-full">
                <h3 className="font-medium mb-2">How to read this map:</h3>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="w-12 h-6 bg-red-500 mx-auto rounded"></div>
                    <p className="text-xs mt-1">Poor health</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-6 bg-yellow-500 mx-auto rounded"></div>
                    <p className="text-xs mt-1">Moderate</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-6 bg-green-500 mx-auto rounded"></div>
                    <p className="text-xs mt-1">Good health</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-6 bg-green-300 mx-auto rounded"></div>
                    <p className="text-xs mt-1">Excellent</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-700">
                  Areas that appear red or yellow may need attention. Consider checking soil moisture, pest issues, or nutrient deficiencies in these locations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Satelite;