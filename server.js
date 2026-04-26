const express = require("express");
const fetch = require("node-fetch");

const app = express();

// 🔥 BODY PARSER (en kritik fix)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// 🔹 Supabase ayarları
const SUPABASE_URL = "https://nwgermmkngkiqknpqnkk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2VybW1rbmdraXFrbnBxbmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDI1MzYsImV4cCI6MjA5MjcxODUzNn0.PIEZZetCgFHCUcRiswgpjFzITAVgqRN4ViSPkRC5d1U"; // ⚠️ güvenlik için gerçek key'i paylaşma

app.post("/data", async (req, res) => {
  try {
    console.log("📥 Gelen veri:", req.body);

    // 🔥 NULL KORUMA (crash engeller)
    if (!req.body) {
      return res.status(400).json({ error: "Body boş geldi" });
    }

    const data = {
      device_id: req.body.device_id ?? "SIM808",
      humidity: req.body.humidity ?? null,
      temperature: req.body.temperature ?? null,
      latitude: req.body.latitude ?? null,
      longitude: req.body.longitude ?? null,
      status: req.body.status ?? "aktif",
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

    // 🔥 Supabase hata kontrolü
    if (!response.ok) {
      return res.status(response.status).json({
        error: text || "Supabase insert failed"
      });
    }

    return res.json({
      success: true,
      message: "Veri kaydedildi"
    });

  } catch (err) {
    console.error("💥 Server Hatası:", err);

    return res.status(500).json({
      error: err.message || "Unknown error"
    });
  }
});

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Server çalışıyor 🚀");
});

// 🔥 PORT FIX (Render için önemli)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});