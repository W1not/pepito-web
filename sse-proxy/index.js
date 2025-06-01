const express = require('express');  
const https = require('https');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir archivos HTML desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Proxy SSE
app.get('/events', (req, res) => {
  const sseUrl = 'https://api.thecatdoor.com/sse/v1/events';

  const proxyReq = https.get(sseUrl, (proxyRes) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    proxyRes.on('data', chunk => {
      console.log("Evento recibido:", chunk.toString()); 
      res.write(chunk);
    });

    proxyRes.on('end', () => {
      res.end();
    });
  });

  proxyReq.on('error', (err) => {
    console.error('Error en el proxy:', err);
    res.status(500).send('Error conectando con la API externa');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
