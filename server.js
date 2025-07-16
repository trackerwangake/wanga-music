const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/api/search', async (req, res) => {
  const yts = require('yt-search');
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search term' });

  try {
    const result = await yts(query);
    const videos = result.videos.slice(0, 5).map(video => ({
      url: video.url,
      title: video.title,
      author: video.author.name,
      thumbnail: video.thumbnail
    }));
    if (videos.length === 0) return res.status(404).json({ error: 'No videos found' });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

app.get('/api/download-mp3', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '').substring(0, 100);

    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    ytdl(videoUrl, {
      filter: 'audioonly',
      quality: 'highestaudio'
    }).pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Download failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
