import { fetchNdviImage } from '../services/sentinelService.js';

export const getNdviImage = async (req, res) => {
  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and Longitude are required.' });
  }

  try {
    const imageBuffer = await fetchNdviImage(lat, lon);

    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error in getNdviImage:', error);
    res.status(500).json({ message: 'Failed to retrieve NDVI image.' });
  }
};
