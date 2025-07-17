// server.js

const express = require('express'); const cors = require('cors'); const bodyParser = require('body-parser'); const multer = require('multer'); const QRCode = require('qrcode'); const fs = require('fs'); const path = require('path');

const app = express(); const upload = multer({ dest: 'uploads/' }); const PORT = process.env.PORT || 3000;

app.use(cors()); app.use(bodyParser.json()); app.use(express.static('public'));

// Generate QR code app.post('/api/generate-qr', async (req, res) => { const { text } = req.body; try { const qr = await QRCode.toDataURL(text); res.json({ qr }); } catch (err) { res.status(500).json({ error: 'Failed to generate QR' }); } });

// Upload for OCR (mock) app.post('/api/ocr', upload.single('image'), (req, res) => { if (!req.file) return res.status(400).send('No file uploaded'); // You'd integrate real OCR here (e.g., Tesseract) res.json({ text: 'Sample OCR result (mock)' }); });

// Provide downloadable package.json app.post('/api/package', (req, res) => { const { tool, code } = req.body;

const allowedTools = ['qr', 'ocr', 'mp3', 'ip', 'camera']; const codes = { qr: 'QR123', ocr: 'OCR456', mp3: 'MP378', ip: 'IP102', camera: 'CAM999' };

if (!allowedTools.includes(tool)) return res.status(400).json

  
