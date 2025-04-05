import React, { useState } from 'react';
import {
  Sprout,
  ThermometerSun,
  Droplets,
  Calendar,
  Fuel,
  Loader2,
  Check,
  BarChart,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';

const VegetableDemandPredictor = () => {
  const [formData, setFormData] = useState({
    Vegetable: 'Cucumber',
    Temperature: '',
    Rainfall: '',
    'Seasonal Factor': '',
    'Fuel Price': ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const vegetables = [
    'Tomato', 'Potato', 'Onion', 'Carrot', 'Cucumber',
    'Cauliflower', 'Spinach', 'Pepper', 'Zucchini'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/predict-demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Prediction failed');

      setPrediction(data.predicted_demand * 100); // Multiplying by 100 as required
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Sprout className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold">Vegetable Demand Predictor</h1>
        </div>
        <p className="text-gray-600">Enter market conditions to predict vegetable demand</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Sprout className="h-5 w-5" />
              Vegetable Type
            </label>
            <div className="relative">
              <select
                name="Vegetable"
                value={formData.Vegetable}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-white pr-10"
                required
              >
                {vegetables.map(veg => (
                  <option key={veg} value={veg}>{veg}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ThermometerSun className="h-5 w-5" />
              Temperature (°C)
            </label>
            <input
              type="number"
              name="Temperature"
              value={formData.Temperature}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter temperature"
              required
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Droplets className="h-5 w-5" />
              Rainfall (mm)
            </label>
            <input
              type="number"
              name="Rainfall"
              value={formData.Rainfall}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter rainfall"
              required
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="h-5 w-5" />
              Seasonal Factor
            </label>
            <input
              type="number"
              name="Seasonal Factor"
              value={formData['Seasonal Factor']}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter seasonal factor"
              required
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Fuel className="h-5 w-5" />
              Fuel Price
            </label>
            <input
              type="number"
              name="Fuel Price"
              value={formData['Fuel Price']}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter fuel price"
              required
              step="0.01"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 flex items-center justify-center gap-2 disabled:bg-green-400"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <BarChart className="h-4 w-4" />
              Predict Demand
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {prediction && !error && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-4">
            <Check className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">Prediction Results</h2>
          </div>
          <div className="p-4 bg-green-50 rounded-md border border-green-100">
            <p className="text-sm text-gray-600">Predicted Demand</p>
            <p className="text-2xl font-bold">{prediction} Units</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VegetableDemandPredictor;
