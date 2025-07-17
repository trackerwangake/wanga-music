const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Allowed tools
const allowedTools = ["battery", "qr", "ocr", "gemini", "yt-api", "chatgpt", "camera", "tracker"];

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Welcome to WANGA TOOLBOX API - Server is running!");
});

// Tool test route
app.post("/api/tool", (req, res) => {
  const tool = req.body.tool;

  if (!tool) {
    return res.status(400).json({ error: "Missing tool name in request body" });
  }

  if (!allowedTools.includes(tool)) {
    return res.status(400).json({ error: "Invalid tool name" });
  }

  // Simulated tool test
  switch (tool) {
    case "battery":
      return res.json({
        status: "success",
        tool,
        result: {
          level: "88%",
          charging: true,
        },
      });

    case "qr":
      return res.json({
        status: "success",
        tool,
        result: {
          info: "QR Code module ready",
        },
      });

    case "ocr":
      return res.json({
        status: "success",
        tool,
        result: {
          text: "Sample OCR Result",
        },
      });

    case "gemini":
    case "chatgpt":
      return res.json({
        status: "success",
        tool,
        result: {
          prompt: "API Key required",
          note: "Use your key to connect to Gemini or ChatGPT",
        },
      });

    case "yt-api":
      return res.json({
        status: "success",
        tool,
        result: {
          data: "YouTube API test passed",
        },
      });

    case "camera":
      return res.json({
        status: "success",
        tool,
        result: {
          device: "Camera Access Granted",
        },
      });

    case "tracker":
      return res.json({
        status: "success",
        tool,
        result: {
          location: "Nairobi, KE",
          ip: req.ip,
        },
      });

    default:
      return res.status(500).json({ error: "Unknown tool handler" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ WANGA TOOLBOX server running at http://localhost:${PORT}`);
});
