// api/market.js
// Recupera le notizie economiche globali (richiede una chiave gratuita
// di NewsAPI, vedi README). I prezzi degli strumenti sono gestiti
// separatamente da api/instrument.js.

export default async function handler(req, res) {
  const news = [];
  const newsKey = process.env.NEWS_API_KEY;

  if (newsKey) {
    try {
      const nRes = await fetch(
        `https://newsapi.org/v2/everything?q=economy%20OR%20markets%20OR%20inflation%20OR%20central%20bank&language=en&sortBy=publishedAt&pageSize=8&apiKey=${newsKey}`
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

  res.status(200).json({ news });
}
