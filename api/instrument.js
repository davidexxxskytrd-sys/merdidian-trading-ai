// api/instrument.js
// Fornisce prezzo attuale, variazione 24h e storico (30 giorni)
// per un singolo strumento, usando CoinGecko (gratuito, senza chiave).

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Parametro id mancante' });
  }

  try {
    const [priceRes, histRes] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`
      ),
      fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`
      )
    ]);

    const priceData = await priceRes.json();
    const histData = await histRes.json();
    const p = priceData[id];

    return res.status(200).json({
      price: p ? p.usd : null,
      changePct: p ? p.usd_24h_change : null,
      history: (histData.prices || []).map((point) => point[1])
    });
  } catch (err) {
    console.error('Errore instrument.js', err);
    return res.status(200).json({ price: null, changePct: null, history: [] });
  }
}
