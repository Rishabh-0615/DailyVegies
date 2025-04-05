import React, { useState } from 'react';
import {
  TrendingUp, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2,
  ThermometerSun,
  Droplets,
  ShoppingCart,
  Calendar,
  Fuel,
  Sprout, // Replaced Plant with Sprout
  HelpCircle,
  ChevronDown,
  IndianRupee
} from 'lucide-react';

const VegetablePricePredictor = () => {
  const [formData, setFormData] = useState({
    Vegetable: 'Cucumber',
    Temperature: '',
    Rainfall: '',
    'Market Demand': '',
    'Seasonal Factor': '',
    'Fuel Price': ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState('');

  const vegetables = [
    'Tomato', 'Potato', 'Onion', 'Carrot', 'Cucumber',
    'Cauliflower', 'Spinach', 'Pepper', 'Zucchini'
  ];

  const tooltips = {
    Temperature: 'Current temperature in Celsius',
    Rainfall: 'Recent rainfall in millimeters',
    'Market Demand': 'Current market demand in Kg/Unit',
    'Seasonal Factor': 'Seasonal influence (0-1)',
    'Fuel Price': 'Current fuel price per liter'
  };

  const getInputIcon = (name) => {
    switch (name) {
      case 'Temperature': return <ThermometerSun className="h-5 w-5 text-gray-500" />;
      case 'Rainfall': return <Droplets className="h-5 w-5 text-gray-500" />;
      case 'Market Demand': return <ShoppingCart className="h-5 w-5 text-gray-500" />;
      case 'Seasonal Factor': return <Calendar className="h-5 w-5 text-gray-500" />;
      case 'Fuel Price': return <Fuel className="h-5 w-5 text-gray-500" />;
      default: return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const transformedData = {
        ...formData,
        'Market Demand': parseFloat(formData['Market Demand']) / 100
      };

      const response = await fetch('http://localhost:5000/api/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Prediction failed');
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Sprout className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Farmer's Price Assistant</h1>
          </div>
          <p className="text-gray-600">Get accurate vegetable price predictions based on market conditions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Sprout className="h-4 w-4" />
                Vegetable Type
              </label>
              <div className="relative">
                <select
                  name="Vegetable"
                  value={formData.Vegetable}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg appearance-none pr-10 bg-white"
                  required
                >
                  {vegetables.map(veg => (
                    <option key={veg} value={veg}>{veg}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {Object.keys(formData)
              .filter(key => key !== 'Vegetable')
              .map(key => (
                <div key={key} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    {getInputIcon(key)}
                    {key}
                    <div className="relative inline-block">
                      <HelpCircle 
                        className="h-4 w-4 text-gray-400 cursor-help"
                        onMouseEnter={() => setTooltipVisible(key)}
                        onMouseLeave={() => setTooltipVisible('')}
                      />
                      {tooltipVisible === key && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md w-48 z-10">
                          {tooltips[key]}
                        </div>
                      )}
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg pl-10"
                      placeholder={`Enter ${key.toLowerCase()}`}
                      required
                      step="0.01"
                      min="0"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      {getInputIcon(key)}
                    </span>
                  </div>
                </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-3 disabled:bg-green-400 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-lg">Analyzing Market...</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-5 w-5" />
                <span className="text-lg">Get Price Prediction</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Prediction Failed</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {prediction && !error && (
          <div className="mt-6 bg-gray-50 rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold">Market Price Prediction</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border-2 border-green-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-gray-600">Predicted Price</p>
                </div>
                <p className="text-3xl font-bold text-green-700">₹{prediction.predicted_price}</p>
              </div>

              {prediction.predicted_range && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-gray-600">Expected Price Range</p>
                  </div>
                  <p className="text-xl text-gray-800">
                    ₹{prediction.predicted_range.min} - ₹{prediction.predicted_range.max}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VegetablePricePredictor;
