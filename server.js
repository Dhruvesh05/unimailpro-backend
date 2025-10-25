// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => res.send("✅ Backend is running."));

// Translation endpoint using LibreTranslate
app.post("/api/translate", async (req, res) => {
  const { text, target } = req.body;
  if (!text || !target) return res.status(400).json({ error: "Text and target language required" });

  try {
    // Use an alternate LibreTranslate server if main one fails
    const libreServers = [
      "https://libretranslate.de/translate",
      "https://translate.argosopentech.com/translate"
    ];

    let translated = null;

    for (let server of libreServers) {
      try {
        const response = await fetch(server, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: text, source: "auto", target, format: "text" }),
        });

        const bodyText = await response.text();

        try {
          const data = JSON.parse(bodyText);
          if (data.translatedText) {
            translated = data.translatedText;
            break; // success, stop trying other servers
          }
        } catch {
          console.warn(`Server ${server} returned non-JSON, trying next server...`);
        }

      } catch (err) {
        console.warn(`Server ${server} request failed, trying next...`);
      }
    }

    if (!translated) return res.status(500).json({ error: "Translation failed on all servers" });

    res.json({ translatedText: translated });

  } catch (err) {
    console.error("Unexpected translation error:", err);
    res.status(500).json({ error: "Translation request failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
