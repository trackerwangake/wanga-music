const express = require('express');
const cors = require('cors');
const axios = require('axios');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const YT_API_KEY = 'AIzaSyB1TB_sPnrOG3C3PbrohpT6SncCMmA7wPA';

app.use(cors());
app.use(express.static('public'));

// Route to search for songs
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search term' });

  try {
    const ytRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        key: YT_API_KEY,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: 10,
      },
    });

    const results = ytRes.data.items.map((item) => ({
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      title: item.snippet.title,
      author: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// Route to fetch MP3 stream info
app.get('/api/ytmp3', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      download_url: format.url,
    });
  } catch (err) {
    res.status(500).json({ error: 'Download failed', details: err.message });
  }
});

// Fallback to serve index.html on root route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
