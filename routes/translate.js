import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// POST /api/translate
router.post("/", async (req, res) => {
  try {
    const { text, target } = req.body;
    if (!text || !target) return res.status(400).json({ error: "Text and target language required" });

    // LibreTranslate API
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: target,
        format: "text"
      }),
    });

    const data = await response.json();
    res.json({ translatedText: data.translatedText });

  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
