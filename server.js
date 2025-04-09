const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const { parseBookDetails } = require('./parser');

const app = express();
app.use(cors());

app.get('/dettagli-libro/:asin', async (req, res) => {
  const asin = req.params.asin;
  const url = `https://www.amazon.com/dp/${asin}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const html = await response.text();
    const dati = parseBookDetails(html);
    res.json({ asin, ...dati });
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dati' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server attivo su http://localhost:${PORT}`);
});