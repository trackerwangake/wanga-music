const express = require('express');
const cors = require('cors');
const path = require('path');
const ytdl = require('ytdl-core');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'AIzaSyB1TB_sPnrOG3C3PbrohpT6SncCMmA7wPA';

app.use(cors());
app.use(express.static('public'));

// 🔍 Search YouTube for videos by name
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search query' });

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=6`;
    const response = await axios.get(url);
    const items = response.data.items;

    const results = items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      author: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// 🎵 Get MP3 download link (trigger download)
app.get('/api/download-mp3', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) return res.status(400).json({ error: 'Missing videoId' });

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

    res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    ytdl(url, { filter: 'audioonly' }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Download failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
