// api/weather.js — Vercel serverless function
export default async function handler(req, res) {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  const OWM_KEY = process.env.OWM_KEY;

  try {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OWM_KEY}&units=metric`
    );
    const current = await currentRes.json();
    if (current.cod !== 200) {
      return res.status(404).json({ error: `City not found: "${city}". Try a different spelling.` });
    }

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OWM_KEY}&units=metric`
    );
    const forecast = await forecastRes.json();

    const totalRain = forecast.list
      ? forecast.list.reduce((sum, item) => sum + (item.rain?.["3h"] || 0), 0)
      : 0;
    const rainfall = Math.round(totalRain * 6);

    const avgClouds = forecast.list
      ? forecast.list.reduce((sum, item) => sum + item.clouds.all, 0) / forecast.list.length
      : 50;
    const sun = ((100 - avgClouds) / 100 * 12).toFixed(1);

    const desc = current.weather[0].description
      .split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    res.status(200).json({
      temp: Math.round(current.main.temp),
      humidity: current.main.humidity,
      rainfall,
      sun,
      desc,
      weatherId: current.weather[0].id,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
}
