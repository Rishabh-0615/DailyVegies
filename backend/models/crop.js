import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    cropName: String,
    sowingDate: Date,
    expectedHarvest: Date,
    location: {
      lat: Number,
      lon: Number
    },
    address: String,
    userId: mongoose.Schema.Types.ObjectId // if auth implemented
  }
);

export const Crop = mongoose.model("Crop", schema);



