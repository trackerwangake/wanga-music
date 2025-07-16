const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;
const YT_API_KEY = 'AIzaSyB1TB_sPnrOG3C3PbrohpT6SncCMmA7wPA';

app.use(cors());
app.use(express.static('public'));

// Search endpoint using YouTube Data API
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search term' });

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=5`;

    const ytRes = await axios.get(url);
    const items = ytRes.data.items;

    if (!items || items.length === 0) {
      return res.status(404).json({ error: 'No video found' });
    }

    const results = items.map(item => ({
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      title: item.snippet.title,
      author: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'YouTube API failed', details: err.message });
  }
});

// Audio info fetch
app.get('/api/ytmp3', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid or missing URL.' });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      download_url: format.url
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video info.', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
