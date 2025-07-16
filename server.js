const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔊 Route: Download MP3 from URL
app.get('/api/ytmp3', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid or missing YouTube URL.' });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
      filter: 'audioonly'
    });

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      quality: '128kbps',
      download_url: audioFormat.url,
      filePath: `${info.videoDetails.videoId}/320.mp3`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video info.', details: err.message });
  }
});

// 🔍 Route: Quick Search via song name / artist
app.get('/api/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query.' });
  }

  try {
    const result = await ytSearch(query);
    const video = result.videos.length > 0 ? result.videos[0] : null;

    if (!video) {
      return res.status(404).json({ error: 'No video found for the query.' });
    }

    res.json({
      title: video.title,
      url: video.url,
      duration: video.timestamp,
      thumbnail: video.thumbnail,
      author: video.author.name
    });
  } catch (err) {
    res.status(500).json({ error: 'Search failed.', details: err.message });
  }
});

// 🔥 Server Start
app.listen(PORT, () => {
  console.log(`🔥 WANGA MUSIC STUDIO backend running on port ${PORT}`);
});
