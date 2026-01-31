const express = require('express');
const path = require('path');
const fs = require('fs');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Live reload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname));
liveReloadServer.server.once('connection', () => {
  setTimeout(() => liveReloadServer.refresh('/'), 100);
});

// Inject livereload script
app.use(connectLivereload());

// Serve index.html with token injected
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace('__MAPBOX_TOKEN__', MAPBOX_TOKEN);
  res.send(html);
});

// Serve other static files
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
