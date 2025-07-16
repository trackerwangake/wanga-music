import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

// Serve frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API for YouTube info
app.get("/api/info", async (req, res) => {
  const videoURL = req.query.url;
  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  const info = await ytdl.getInfo(videoURL);
  const videoDetails = info.videoDetails;

  res.json({
    title: videoDetails.title,
    thumbnail: videoDetails.thumbnails.pop().url,
    formats: {
      mp3: `/api/download?url=${encodeURIComponent(videoURL)}&format=mp3`,
      mp4: `/api/download?url=${encodeURIComponent(videoURL)}&format=mp4`,
    },
  });
});

// API for download
app.get("/api/download", (req, res) => {
  const videoURL = req.query.url;
  const format = req.query.format;

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).send("Invalid URL");
  }

  const contentType = format === "mp3" ? "audio/mpeg" : "video/mp4";
  res.header("Content-Disposition", `attachment; filename="video.${format}"`);
  res.header("Content-Type", contentType);

  ytdl(videoURL, {
    quality: format === "mp3" ? "highestaudio" : "highestvideo",
    filter: format === "mp3" ? "audioonly" : "videoandaudio",
  }).pipe(res);
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
