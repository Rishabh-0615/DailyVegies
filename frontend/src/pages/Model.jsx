import React, { useState } from "react";

const Model = () => {
  const [vegetable, setVegetable] = useState("Tomato");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [previousDemand, setPreviousDemand] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [season, setSeason] = useState("Spring");
  const [dayType, setDayType] = useState("Weekday");
  const [predictedDemand, setPredictedDemand] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/predict-demand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vegetable,
          available_quantity: parseFloat(availableQuantity),
          previous_demand: parseFloat(previousDemand),
          price_per_unit: parseFloat(pricePerUnit),
          season,
          day_type: dayType
        }),
      });
      
      const data = await response.json();
      setPredictedDemand(data.predicted_demand);
    } catch (error) {
      console.error("Error predicting demand:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f0f9f0",
    padding: "2rem"
  };

  const cardStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "1px solid #86efac"
  };

  const headerStyle = {
    borderBottom: "1px solid #86efac",
    padding: "1.5rem",
    textAlign: "center",
    color: "#166534",
    fontSize: "1.5rem",
    fontWeight: "bold",
    backgroundColor: "#f0fdf4"
  };

  const formContainerStyle = {
    padding: "1.5rem"
  };

  const inputGroupStyle = {
    marginBottom: "1rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    color: "#166534",
    fontSize: "0.875rem",
    fontWeight: "500"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #86efac",
    marginBottom: "1rem",
    outline: "none"
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "white"
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s"
  };

  const buttonHoverStyle = {
    backgroundColor: "#15803d"
  };

  const resultStyle = {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: "0.375rem",
    textAlign: "center",
    color: "#166534",
    fontWeight: "500"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          Farm-to-Table Demand Prediction
        </div>
        
        <div style={formContainerStyle}>
          <form onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Vegetable
              </label>
              <select
                value={vegetable}
                onChange={(e) => setVegetable(e.target.value)}
                style={selectStyle}
              >
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Carrot">Carrot</option>
                <option value="Spinach">Spinach</option>
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Available Quantity
              </label>
              <input
                type="number"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                placeholder="Enter available quantity"
                required
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Previous Demand
              </label>
              <input
                type="number"
                value={previousDemand}
                onChange={(e) => setPreviousDemand(e.target.value)}
                placeholder="Enter previous demand"
                required
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Price per Unit/Kg (₹)
              </label>
              <input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="Enter price per unit"
                required
                style={inputStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                style={selectStyle}
              >
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Day Type
              </label>
              <select
                value={dayType}
                onChange={(e) => setDayType(e.target.value)}
                style={selectStyle}
              >
                <option value="Weekday">Weekday</option>
                <option value="Weekend">Weekend</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                ...(loading ? { opacity: 0.7 } : {}),
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = buttonStyle.backgroundColor;
                }
              }}
            >
              {loading ? "Predicting..." : "Predict Demand"}
            </button>
          </form>

          {predictedDemand !== null && (
            <div style={resultStyle}>
              Predicted Demand: {predictedDemand} units
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Model;