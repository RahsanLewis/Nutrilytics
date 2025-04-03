import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5050;
const API_KEY = "2RJFz4agPvZJN6rwuFiGxegfeU0zfPQkVm6WLkJ3";

app.use(cors());
app.use(express.json());

app.post("/api/nutrition", async (req, res) => {
  try {
    const response = await fetch("https://api.nal.usda.gov/fdc/v1/foods/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY,
        },
        body: JSON.stringify(req.body),
      });      

    // Check for non-200 response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ USDA API Error:", response.status, errorText);
      return res.status(500).json({ error: "USDA API error", details: errorText });
    }

    const data = await response.json();
    console.log("✅ USDA API returned data:", Array.isArray(data) ? `${data.length} items` : data);

    res.json(data);
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: "Failed to fetch data from USDA" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Proxy server running at http://localhost:${PORT}`)
);
