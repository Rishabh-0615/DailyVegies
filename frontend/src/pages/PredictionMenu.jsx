import React from "react";
import { TrendingUp, ShoppingCart, Calculator, BarChart, Droplet, Leaf, Bug, Thermometer, Cloud, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Model1 from "./Model";
import Model2 from "./Model"; 

const PredictionMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Prediction Tools</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Make data-driven decisions for your farm business with our AI-powered prediction tools.
          Forecast prices, demand, resource usage, and disease risks to optimize your farming operations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Price Prediction Card */}
        <div 
          onClick={() => navigate("/model1")}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-300 transform hover:-translate-y-2"
        >
          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
              Price Prediction
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Forecast the future market prices of your crops based on historical data, market trends, and seasonal factors.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calculator className="h-4 w-4 mr-1" />
                <span>Market Analysis</span>
              </div>
              <div className="flex items-center">
                <BarChart className="h-4 w-4 mr-1" />
                <span>Price Trends</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-green-50 rounded-b-xl">
            <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center">
              <span>Start Price Prediction</span>
            </button>
          </div>
        </div>

        {/* Demand Prediction Card */}
        <div 
          onClick={() => navigate("/model2")}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-300 transform hover:-translate-y-2"
        >
          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
              Demand Prediction
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Anticipate consumer demand for specific crops to optimize your planting decisions and maximize sales opportunities.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <BarChart className="h-4 w-4 mr-1" />
                <span>Consumer Trends</span>
              </div>
              <div className="flex items-center">
                <Calculator className="h-4 w-4 mr-1" />
                <span>Seasonal Analysis</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-green-50 rounded-b-xl">
            <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center">
              <span>Start Demand Prediction</span>
            </button>
          </div>
        </div>

        {/* Resource Management Card */}
        <div 
          onClick={() => navigate("/resource")}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-300 transform hover:-translate-y-2"
        >
          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Droplet className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
              Resource Management
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Optimize water, fertilizer, and energy usage based on soil conditions, weather forecasts, and crop requirements.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-1" />
                <span>Weather Impact</span>
              </div>
              <div className="flex items-center">
                <Leaf className="h-4 w-4 mr-1" />
                <span>Soil Analysis</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-green-50 rounded-b-xl">
            <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center">
              <span>Start Resource Planning</span>
            </button>
          </div>
        </div>

        {/* Crop Disease Prediction Card */}
        <div 
          onClick={() => navigate("/predict-dis")}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-300 transform hover:-translate-y-2"
        >
          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Bug className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
              Crop Disease Prediction
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Detect and predict potential crop diseases and pest outbreaks before they spread, allowing for early intervention.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Bug className="h-4 w-4 mr-1" />
                <span>Pest Analysis</span>
              </div>
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-1" />
                <span>Climate Factors</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-green-50 rounded-b-xl">
            <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center">
              <span>Start Disease Screening</span>
            </button>
          </div>
        </div>

        {/* Weather Prediction Card */}
        <div 
          onClick={() => navigate("/weather")}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-300 transform hover:-translate-y-2"
        >
          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Cloud className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
              Weather Prediction
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Get hyper-local weather forecasts tailored to your farm's location to plan planting, harvesting, and field operations.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-1" />
                <span>Temperature Models</span>
              </div>
              <div className="flex items-center">
                <Droplet className="h-4 w-4 mr-1" />
                <span>Precipitation Analysis</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-green-50 rounded-b-xl">
            <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center">
              <span>Start Weather Forecast</span>
            </button>
          </div>
        </div>

        {/* Goods Quality Prediction Card */}
        <div 
          onClick={() => navigate("/satelite")}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-green-100 hover:border-green-300 transform hover:-translate-y-2"
        >
          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
              Goods Quality Prediction
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Predict the quality grades of your harvest based on growing conditions, handling processes, and storage factors.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Leaf className="h-4 w-4 mr-1" />
                <span>Quality Metrics</span>
              </div>
              <div className="flex items-center">
                <Calculator className="h-4 w-4 mr-1" />
                <span>Grade Analysis</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-green-50 rounded-b-xl">
            <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center">
              <span>Start Quality Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionMenu;