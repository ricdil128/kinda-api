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

  $('#detailBullets_feature_div li span.a-list-item').each((i, el) => {
    const text = cleanText($(el).text());
    if (text.toLowerCase().includes('print length')) {
      pages = text.replace(/.*print length[:\s]*/i, '');
    }
    if (text.toLowerCase().includes('publication date')) {
      date = text.replace(/.*publication date[:\s]*/i, '');
    }
    if (text.toLowerCase().includes('publisher')) {
      publisher = text.replace(/.*publisher[:\s]*/i, '');
    }
  });

  if (!pages || !date || !publisher) {
    $('li').each((i, el) => {
      const text = cleanText($(el).text());
      if (text.toLowerCase().startsWith('print length')) {
        pages = text.replace(/print length[:\s]*/i, '');
      }
      if (text.toLowerCase().startsWith('publication date')) {
        date = text.replace(/publication date[:\s]*/i, '');
      }
      if (text.toLowerCase().startsWith('publisher')) {
        publisher = text.replace(/publisher[:\s]*/i, '');
      }
    });
  }

  return {
    pages: pages || null,
    date: date || null,
    publisher: publisher ? publisher.replace(/\(.*?\)/, '').trim() : null
  };
}

module.exports = { parseBookDetails };