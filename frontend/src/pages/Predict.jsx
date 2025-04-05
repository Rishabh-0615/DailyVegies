import React, { useState } from "react";
import axios from "axios";

function Predict() {
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handleCheck = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/predict", { text });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Fake News Detector</h1>
      <textarea
        className="p-2 border border-gray-400 w-96 h-32"
        placeholder="Enter news content..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleCheck}
      >
        Check News
      </button>
      {prediction !== null && (
        <p className="mt-4 text-lg font-bold">
          {prediction === 1 ? "❌ Fake News" : "✅ Real News"}
        </p>
      )}
    </div>
  );
}

export default Predict;
