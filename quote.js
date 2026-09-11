// api/quote.js
// Fornisce prezzo, variazione e storico per forex, indici e materie prime,
// usando Twelve Data (richiede una chiave gratuita, vedi README).
// Le criptovalute continuano a passare da api/instrument.js (CoinGecko).

export default async function handler(req, res) {
  const { symbol } = req.query;
  const apiKey = process.env.TWELVEDATA_API_KEY;

  if (!apiKey || !symbol) {
    return res.status(200).json({ price: null, changePct: null, history: [] });
  }

  try {
    const [quoteRes, seriesRes] = await Promise.all([
      fetch(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`),
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
