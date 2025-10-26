// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

const app = express();

// ✅ Configure CORS to allow your Vercel frontend
app.use(
  cors({
    origin: [
      "https://unimailpro.vercel.app", // your deployed frontend
      "http://localhost:5173" // optional: for local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Simple root route to confirm backend is live
app.get("/", (req, res) => res.send("✅ UniMailPro backend is running."));

// ✅ Test route to check frontend-backend connection
app.get("/api/test", (req, res) => {
  res.send("✅ Backend is live and connected with frontend!");
});

// 🌐 Translation endpoint using LibreTranslate
app.post("/api/translate", async (req, res) => {
  const { text, target } = req.body;
  if (!text || !target)
    return res.status(400).json({ error: "Text and target language required" });

  try {
    // Alternate LibreTranslate servers
    const libreServers = [
      "https://libretranslate.de/translate",
      "https://translate.argosopentech.com/translate",
    ];

    let translated = null;

    for (let server of libreServers) {
      try {
        const response = await fetch(server, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: "auto",
            target,
            format: "text",
          }),
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

    if (!translated)
      return res.status(500).json({ error: "Translation failed on all servers" });

    res.json({ translatedText: translated });
  } catch (err) {
    console.error("Unexpected translation error:", err);
    res.status(500).json({ error: "Translation request failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 UniMailPro backend running on port ${PORT}`));
