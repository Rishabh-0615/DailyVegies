// models/crop.js
import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
  },
  sowingDate: {
    type: Date,
    required: true,
  },
  expectedHarvest: {
    type: Date,
    required: true,
  },
  location: {
    lat: Number,
    lon: Number,
  },
  address: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

export const Crop = mongoose.model("Crop", cropSchema);
