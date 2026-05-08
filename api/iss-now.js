export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const upstream = await fetch("http://api.open-notify.org/iss-now.json");
    if (!upstream.ok) {
      throw new Error(`Open Notify returned ${upstream.status}`);
    }

    const data = await upstream.json();
    return response.status(200).json(data);
  } catch (error) {
    return response.status(502).json({
      message: "Unable to fetch ISS position",
      error: error.message,
    });
  }
}
