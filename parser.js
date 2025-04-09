const cheerio = require('cheerio');

function cleanText(text) {
  return text
    .replace(/\u200E|\u200F|\n/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseBookDetails(html) {
  const $ = cheerio.load(html);
  let pages = null, date = null, publisher = null;

  // Cerca nei dettagli classici
  $('li span.a-list-item').each((i, el) => {
    const text = cleanText($(el).text());

    if (!pages && text.toLowerCase().includes('pages')) {
      const match = text.match(/\d+\s+pages/);
      if (match) pages = match[0];
    }

    if (!publisher && text.toLowerCase().includes('publisher')) {
      const publisherMatch = text.match(/Publisher\s*[:：]\s*([^\(]+)(?:\(([^\)]+)\))?/i);
      if (publisherMatch) {
        publisher = publisherMatch[1].trim();
        if (publisherMatch[2]) date = publisherMatch[2].trim();
      }
    }
  });

  return {
    pages: pages || null,
    date: date || null,
    publisher: publisher || null
  };
}

module.exports = { parseBookDetails };