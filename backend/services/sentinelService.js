import fetch from 'node-fetch';

const SENTINEL_INSTANCE_ID = "f576e568-d219-4f0b-944d-859d6906ea53";

export const fetchNdviImage = async (lat, lon) => {
  const delta = 0.01; // Size of the box around the coordinates
  const bbox = `${lat - delta},${lon - delta},${lat + delta},${lon + delta}`;

  const url = `https://services.sentinel-hub.com/ogc/wms/${SENTINEL_INSTANCE_ID}?` +
              `REQUEST=GetMap&BBOX=${bbox}&LAYERS=NDVI&MAXCC=20&WIDTH=512&HEIGHT=512&` +
              `FORMAT=image/png&SRS=EPSG:4326`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch NDVI from Sentinel Hub');
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};
