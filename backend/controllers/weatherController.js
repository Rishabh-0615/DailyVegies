import axios from "axios";
import TryCatch from "../utils/TryCatch.js";

export const getForecast = TryCatch(async (req, res) => {
  const { lat, lon } = req.query;
  const API_KEY = "36ddead7555dd88f91810c38604479af";

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  // Process the data to make it more frontend-friendly
  const processedData = {
    city: response.data.city,
    list: response.data.list.map(item => ({
      dt: item.dt,
      main: {
        temp: item.main.temp,
        humidity: item.main.humidity,
      },
      weather: item.weather,
      wind: item.wind
    }))
  };

  res.json(processedData);
});