// server.js
const express = require("express");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// 📌 Route to search YouTube by keyword (title/artist)
app.get("/api/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    const result = await ytSearch(query);
    const video = result.videos[0];
    if (!video) return res.status(404).json({ error: "No video found" });

    return res.json({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      duration: video.timestamp,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Search failed" });
  }
});

// 📌 Route to fetch info & download URLs from a YouTube link
app.get("/api/info", async (req, res) => {
  const { url } = req.query;
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    const info = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: "18" });

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      audio: {
        quality: audioFormat.audioBitrate + "kbps",
        url: audioFormat.url,
      },
      video: {
        quality: videoFormat.qualityLabel,
        url: videoFormat.url,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
