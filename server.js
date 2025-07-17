const express = require('express');
const cors = require('cors');
const path = require('path');
const ytdl = require('ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/download', async (req, res) => {
  const { url, format } = req.query;
  if (!ytdl.validateURL(url)) return res.status(400).send('Invalid URL');

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
  res.header('Content-Disposition', `attachment; filename="${title}.${format}"`);

  const options = format === 'mp3'
    ? { filter: 'audioonly', quality: 'highestaudio' }
    : { quality: 'highest' };

  ytdl(url, options).pipe(res);
});

app.listen(PORT, () => {
  console.log(`✅ WANGA TOOLBOX running on http://localhost:${PORT}`);
});
