// api/market.js
// Recupera prezzi (crypto sempre gratis via CoinGecko, senza chiave)
// e notizie (richiede una chiave gratuita di NewsAPI, vedi README).

export default async function handler(req, res) {
  const items = [];
  const news = [];

  // ---- Prezzi crypto: CoinGecko, gratuito e senza chiave ----
  try {
    const cgRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
    );
    const cg = await cgRes.json();
    const labels = { bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL' };
    for (const key of Object.keys(labels)) {
      if (cg[key]) {
        items.push({
          symbol: labels[key],
          price: '$' + cg[key].usd.toLocaleString('en-US'),
          changePct: cg[key].usd_24h_change || 0
        });
      }
    }
  } catch (e) {
    console.error('Errore CoinGecko', e);
  }

  // ---- Prezzi azionari/forex: opzionale, richiede ALPHA_VANTAGE_KEY ----
  const avKey = process.env.ALPHA_VANTAGE_KEY;
  if (avKey) {
    const symbols = ['SPY', 'QQQ']; // ETF sugli indici USA, come esempio
    for (const sym of symbols) {
      try {
        const r = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${avKey}`
        );
        const j = await r.json();
        const q = j['Global Quote'];
        if (q && q['05. price']) {
          items.push({
            symbol: sym,
            price: '$' + parseFloat(q['05. price']).toFixed(2),
            changePct: parseFloat(q['10. change percent']?.replace('%', '') || '0')
          });
        }
      } catch (e) {
        console.error('Errore Alpha Vantage', sym, e);
      }
    }
  }

  // ---- Notizie: opzionale, richiede NEWS_API_KEY (piano free su newsapi.org) ----
  const newsKey = process.env.NEWS_API_KEY;
  if (newsKey) {
    try {
      const nRes = await fetch(
        `https://newsapi.org/v2/everything?q=stock%20market%20OR%20crypto%20OR%20economy&language=en&sortBy=publishedAt&pageSize=8&apiKey=${newsKey}`
      );
      const nData = await nRes.json();
      if (nData.articles) {
        for (const a of nData.articles) {
          news.push({
            source: a.source?.name || 'Fonte',
            time: new Date(a.publishedAt).toLocaleString('it-IT', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            }),
            title: a.title,
            summary: a.description || ''
          });
        }
      }
    } catch (e) {
      console.error('Errore NewsAPI', e);
    }
  }

  res.status(200).json({ items, news });
}
