const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.get('/download', async (req, res) => {
  const url = req.query.url;
  const format = req.query.format || 'mp4';
  if (!ytdl.validateURL(url)) return res.status(400).send("Invalid YouTube URL.");

  const title = (await ytdl.getInfo(url)).videoDetails.title.replace(/[^a-z0-9]/gi, '_');
  res.header('Content-Disposition', `attachment; filename="${title}.${format}"`);

  if (format === 'mp3') {
    ytdl(url, { filter: 'audioonly' }).pipe(res);
  } else {
    ytdl(url).pipe(res);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));
