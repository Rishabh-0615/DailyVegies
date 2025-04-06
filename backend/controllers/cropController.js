import { Crop } from "../models/crop.js";

export const addCrop = async (req, res) => {
  try {
    const { cropName, sowingDate, expectedHarvest, location, address } = req.body;

    if (!cropName || !sowingDate || !expectedHarvest || !location?.lat || !location?.lon || !address) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const crop = new Crop({ 
      cropName, 
      sowingDate, 
      expectedHarvest, 
      location, 
      address 
    });
    
    await crop.save();
    res.status(201).json({ message: "Crop added successfully", crop });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};