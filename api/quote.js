// api/quote.js
// Fornisce prezzo, variazione e storico per forex, indici e materie prime,
// usando Twelve Data (richiede una chiave gratuita, vedi README).
// Le criptovalute continuano a passare da api/instrument.js (CoinGecko).

export default async function handler(req, res) {
  const { symbol, symbols, basic } = req.query;
  const apiKey = process.env.TWELVEDATA_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ price: null, changePct: null, history: [], quotes: {} });
  }

  // Modalità multipla: più simboli in una sola chiamata (usata dalla pagina Mercati)
  if (symbols) {
    try {
      const res2 = await fetch(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbols)}&apikey=${apiKey}`);
      const data = await res2.json();
      const quotes = {};
      const symbolList = symbols.split(',');
      if (symbolList.length === 1) {
        // Twelve Data restituisce un oggetto singolo se c'è un solo simbolo
        quotes[symbolList[0]] = {
          price: data.close ? parseFloat(data.close) : null,
          changePct: data.percent_change ? parseFloat(data.percent_change) : null
        };
      } else {
        for (const key of Object.keys(data)) {
          const q = data[key];
          if (q && q.close) {
            quotes[key] = { price: parseFloat(q.close), changePct: parseFloat(q.percent_change) };
          }
        }
      }
      return res.status(200).json({ quotes });
    } catch (err) {
      console.error('Errore quote.js (batch)', err);
      return res.status(200).json({ quotes: {} });
    }
  }

  if (!symbol) {
    return res.status(200).json({ price: null, changePct: null, history: [] });
  }

  try {
    const quoteReq = fetch(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`);

    if (basic === '1') {
      // Solo il prezzo, niente storico: usato per l'aggiornamento automatico leggero
      const quoteRes = await quoteReq;
      const quote = await quoteRes.json();
      return res.status(200).json({
        price: quote.close ? parseFloat(quote.close) : null,
        changePct: quote.percent_change ? parseFloat(quote.percent_change) : null,
        history: []
      });
    }

    const [quoteRes, seriesRes] = await Promise.all([
      quoteReq,
      fetch(`https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=1day&outputsize=30&apikey=${apiKey}`)
    ]);

    const quote = await quoteRes.json();
    const series = await seriesRes.json();

    const history = Array.isArray(series.values)
      ? series.values.map((v) => parseFloat(v.close)).reverse()
      : [];

    return res.status(200).json({
      price: quote.close ? parseFloat(quote.close) : null,
      changePct: quote.percent_change ? parseFloat(quote.percent_change) : null,
      history
    });
  } catch (err) {
    console.error('Errore quote.js', symbol, err);
    return res.status(200).json({ price: null, changePct: null, history: [] });
  }
}
