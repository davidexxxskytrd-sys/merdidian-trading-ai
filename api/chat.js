// api/chat.js
// Questa funzione gira sul server (mai nel browser), quindi la chiave API
// resta sempre nascosta. Il sito la chiama tramite fetch('/api/chat').

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      reply:
        "L'assistente non è ancora configurato: manca la chiave ANTHROPIC_API_KEY nelle impostazioni del sito. Segui il file README per aggiungerla."
    });
  }

  try {
    const { messages } = req.body;

    // Portiamo solo le ultime domande per non far crescere troppo il costo
    const recent = (messages || []).slice(-10);

    const systemPrompt = `Sei Meridian, l'assistente AI di un sito di informazione finanziaria.
Rispondi in italiano, in modo chiaro e diretto, a domande su notizie, mercati, azioni, forex e criptovalute.
Puoi spiegare dinamiche di mercato, contesto storico e ragionamenti generali.
Non sei un consulente finanziario autorizzato: non dare mai istruzioni operative dirette del tipo "compra" o "vendi",
ma aiuta l'utente a capire la situazione e i fattori in gioco, ricordando quando serve che non è consulenza personalizzata.
Se non hai informazioni aggiornate su un evento specifico, dillo onestamente invece di inventare numeri.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 600,
        system: systemPrompt,
        messages: recent
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Anthropic API error:', data.error);
      // NOTA TEMPORANEA PER IL DEBUG: mostriamo il dettaglio dell'errore
      // direttamente in chat, così è più facile capire cosa non va.
      // Una volta che tutto funziona, si può togliere questa parte.
      return res.status(200).json({
        reply: `L'assistente non è riuscito a rispondere. Dettaglio errore: ${data.error.type || ''} — ${data.error.message || 'sconosciuto'}`
      });
    }

    const reply = data.content?.map((c) => c.text || '').join('\n') || '';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      reply: 'Si è verificato un errore imprevisto. Riprova tra poco.'
    });
  }
}
