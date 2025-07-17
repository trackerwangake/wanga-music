const express = require('express');
const path = require('path');
const app = express();
const startTime = new Date();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/uptime', (req, res) => {
  const now = new Date();
  const uptime = Math.floor((now - startTime) / 1000);
  const hrs = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const secs = uptime % 60;
  res.json({ uptime: `${hrs}h ${mins}m ${secs}s` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
