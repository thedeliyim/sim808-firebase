const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔹 Supabase ayarları
const SUPABASE_URL = "https://nwgermmkngkiqknpqnkk.supabase.co";
const SUPABASE_KEY = "BURAYA_ANON_KEY"; // anon public

app.post("/data", async (req, res) => {
  try {
    console.log("📥 Gelen veri:", req.body);

    const data = {
      device_id: req.body.device_id || "SIM808",
      humidity: req.body.humidity,
      temperature: req.body.temperature,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      status: req.body.status || "aktif",
      timestamp: new Date().toISOString()
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/device_data`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(data)
    });

    const text = await response.text();

    console.log("📤 Supabase cevap:", text);

    if (!response.ok) {
      return res.status(500).json({ error: text });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("💥 Hata:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Server çalışıyor 🚀");
});

app.listen(3000, () => {
  console.log("Server 3000 portunda çalışıyor");
});