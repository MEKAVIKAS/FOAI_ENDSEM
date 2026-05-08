export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");

  const { lat, lon } = request.query;
  if (!lat || !lon) {
    return response.status(400).json({ message: "lat and lon are required" });
  }

  try {
    const params = new URLSearchParams({
      format: "json",
      lat,
      lon,
      zoom: "10",
      addressdetails: "1",
    });
    const upstream = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
      headers: {
        "User-Agent": "ISS-AI-News-Dashboard/1.0",
      },
    });

    if (!upstream.ok) {
      throw new Error(`Nominatim returned ${upstream.status}`);
    }

    const data = await upstream.json();
    return response.status(200).json(data);
  } catch (error) {
    return response.status(502).json({
      message: "Unable to reverse geocode ISS position",
      error: error.message,
    });
  }
}
