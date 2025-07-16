const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search term' });

  try {
    const result = await yts(query);
    if (result && result.videos.length > 0) {
      const video = result.videos[0];
      res.json({
        url: video.url,
        title: video.title,
        author: video.author.name,
        thumbnail: video.thumbnail
      });
    } else {
      res.status(404).json({ error: 'No video found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

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
      download_url: `/api/download-mp3?url=${encodeURIComponent(videoUrl)}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video info.', details: err.message });
  }
});

app.get('/api/download-mp3', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).send('Invalid URL');
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);

    ytdl(videoUrl, {
      filter: 'audioonly',
      quality: 'highestaudio',
    }).pipe(res);
  } catch (error) {
    res.status(500).send('Failed to download audio.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
