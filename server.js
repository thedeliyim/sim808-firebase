const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

app.post("/data", async (req, res) => {
  try {
    const response = await fetch(
      "https://ormanyangin-f0ec6-default-rtdb.firebaseio.com/data.json",
      {
        method: "PUT",
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text();
    res.send(text);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.get("/", (req, res) => {
  res.send("API çalışıyor");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});