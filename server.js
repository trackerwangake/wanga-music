const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

// Search for songs by name/artist (returns top 5 matches)
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search term' });

  try {
    const result = await yts(query);
    const videos = result.videos.slice(0, 5).map(video => ({
      url: video.url,
      title: video.title,
      author: video.author.name,
      thumbnail: video.thumbnail,
      duration: video.timestamp
    }));
    res.json({ results: videos });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// Get MP3 download URL for selected YouTube video
app.get('/api/ytmp3', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid or missing URL.' });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.filterFormats(info.formats, 'audioonly')[0];

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails?.pop()?.url,
      download_url: format.url
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audio.', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
