// import React from 'react'

// const PredictionMenu = () => {
//   return (
//     <div>
//       <h1>This is Predict page</h1>
//     </div>
//   )
// }

// export default PredictionMenu


















import React from "react";
import { TrendingUp, ShoppingCart, Calculator, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Model1 from "./Model"
import Model2 from "./Model" 

const PredictionMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Prediction Tools</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Make data-driven decisions for your farm business with our AI-powered prediction tools.
          Forecast prices and demand to optimize your planting and harvesting schedule.
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
      </div>
    </div>
  );
};

export default PredictionMenu;