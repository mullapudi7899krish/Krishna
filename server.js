const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BP Project is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/bank', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/bank/*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
