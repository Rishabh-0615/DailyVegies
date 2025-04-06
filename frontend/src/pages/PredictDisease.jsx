import React, { useState } from 'react';
import axios from 'axios';
import { Info, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

const DiseasePredictionPage = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [treatmentInfo, setTreatmentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Disease treatments database
  const diseaseTreatments = {
    "Tomato Late Blight": {
      symptoms: "Dark, water-soaked spots on leaves that quickly turn brown. White fungal growth may appear on the underside of leaves in humid conditions.",
      causes: "Caused by the oomycete Phytophthora infestans, thrives in cool, wet weather.",
      treatment: "Remove and destroy infected plants, apply copper-based fungicides preventatively, ensure proper spacing for air circulation, avoid overhead watering, and use resistant varieties in future plantings.",
      prevention: "Rotate crops, use disease-free seeds, maintain plant health with balanced nutrition, and monitor weather conditions."
    },
    "Corn Common Rust": {
      symptoms: "Small, circular to elongated, powdery rust-colored pustules appear on both leaf surfaces.",
      causes: "Caused by the fungus Puccinia sorghi, favored by cool temperatures and high humidity.",
      treatment: "Apply fungicides early at first sign of infection, remove heavily infected leaves, and maintain proper plant nutrition.",
      prevention: "Plant resistant varieties, rotate crops, and avoid overhead irrigation."
    },
    "Rice Bacterial Blight": {
      symptoms: "Water-soaked lesions that turn yellow to white and eventually gray along the leaf veins.",
      causes: "Caused by Xanthomonas oryzae pv. oryzae bacteria, spreads through irrigation water and infected seeds.",
      treatment: "No chemical control is fully effective; remove infected plants, use copper-based products as preventatives, and manage water carefully.",
      prevention: "Use resistant varieties, treat seeds with hot water, maintain field hygiene, and avoid excess nitrogen fertilization."
    },
    "Potato Early Blight": {
      symptoms: "Dark brown spots with concentric rings creating a target-like pattern on older leaves first.",
      causes: "Caused by Alternaria solani fungus, favored by warm, humid conditions.",
      treatment: "Apply appropriate fungicides, remove infected leaves, and ensure adequate plant nutrition.",
      prevention: "Use crop rotation, provide adequate spacing, mulch soil, and water at the base of plants."
    },
    "Wheat Stripe Rust": {
      symptoms: "Yellow-orange pustules arranged in stripes along leaf veins.",
      causes: "Caused by Puccinia striiformis fungus, favors cool, moist conditions.",
      treatment: "Apply foliar fungicides at early infection stages, particularly before flowering.",
      prevention: "Plant resistant varieties, monitor fields regularly, and time planting to avoid peak disease conditions."
    },
    // Default case for unknown diseases
    "Unknown disease": {
      symptoms: "Symptoms vary based on specific disease.",
      causes: "Multiple potential causes including fungi, bacteria, viruses, or environmental stress.",
      treatment: "Consult with a local agricultural extension service for proper diagnosis and targeted treatment recommendations.",
      prevention: "Maintain good field hygiene, use crop rotation, ensure balanced plant nutrition, and monitor plants regularly."
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setDiseaseResult(null);
      setTreatmentInfo(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setDiseaseResult(null);
      setTreatmentInfo(null);
    }
  };

  const predictDisease = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    setIsLoading(true);
    setError(null);
    
    try {
      // Use the original API call implementation
      const res = await axios.post('/api/predict-disease', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const detectedDisease = res.data.prediction || res.data.disease || "Unknown disease";
      setDiseaseResult(detectedDisease);
      
      // Get treatment information based on the detected disease
      const treatment = diseaseTreatments[detectedDisease] || diseaseTreatments["Unknown disease"];
      setTreatmentInfo(treatment);
      
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.response?.data?.message || 'Error predicting disease');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">🌿 Crop Disease Detection</h1>
        <p className="text-gray-600 mt-2">Upload a crop leaf image to detect diseases and get treatment recommendations</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Info size={24} className="text-green-600" />
                </div>
              </div>
              <p className="text-gray-600">Drag and drop your image here or</p>
              <label className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer">
                Browse Files
                <input 
                  type="file" 
                  onChange={handleImageUpload} 
                  accept="image/*"
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {imagePreview && (
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full max-w-md h-64 object-cover rounded-lg shadow-lg" 
                />
                <button 
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    setDiseaseResult(null);
                    setTreatmentInfo(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <button
            onClick={predictDisease}
            disabled={isLoading || !image}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg w-full flex items-center justify-center ${
              (isLoading || !image) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Analyze Leaf & Detect Disease'
            )}
          </button>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-700 border border-red-200">
              <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          {!diseaseResult && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">No Analysis Yet</h3>
                <p className="mt-1">Upload a crop image and click analyze to get disease detection and treatment recommendations</p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
              <div className="animate-pulse flex flex-col items-center">
                <div className="bg-gray-200 h-8 w-3/4 mb-4 rounded"></div>
                <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
                <div className="bg-gray-200 h-4 w-5/6 mb-2 rounded"></div>
                <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
                <div className="flex items-center mb-4">
                  <CheckCircle size={24} className="text-green-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">Disease Detection Results</h2>
                </div>
                <div className="bg-green-50 p-3 rounded-lg mb-4 border border-green-100">
                  <p className="font-medium text-lg">Detected Disease:</p>
                  <p className="text-2xl font-bold text-green-800">{diseaseResult}</p>
                </div>
              </div>

              {treatmentInfo && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <h3 className="font-bold text-blue-800 mb-2">Symptoms</h3>
                    <p>{treatmentInfo.symptoms}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-amber-100">
                    <h3 className="font-bold text-amber-800 mb-2">Causes</h3>
                    <p>{treatmentInfo.causes}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-100">
                    <h3 className="font-bold text-green-800 mb-2">Treatment</h3>
                    <p>{treatmentInfo.treatment}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-purple-100">
                    <h3 className="font-bold text-purple-800 mb-2">Prevention</h3>
                    <p>{treatmentInfo.prevention}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm">
        <p><strong>Disclaimer:</strong> This tool provides preliminary disease detection and general treatment advice. 
        For accurate diagnosis and specific treatment plans, please consult with a professional agricultural extension service or plant pathologist.</p>
      </div>
    </div>
  );
};

export default DiseasePredictionPage;