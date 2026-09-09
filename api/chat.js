// api/chat.js
// Usa Gemini (Google AI Studio), che ha un piano gratuito permanente
// (a differenza di Anthropic, che richiede credito pre-pagato).
// La chiave resta sempre sul server, mai visibile nel browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      reply:
        "L'assistente non è ancora configurato: manca la chiave GEMINI_API_KEY nelle impostazioni del sito. Segui il file README per aggiungerla."
    });
  }

  // Puoi cambiare modello senza toccare il codice, impostando la variabile
  // d'ambiente GEMINI_MODEL su Vercel. Se in futuro questo modello non
  // fosse più disponibile, controlla l'elenco aggiornato qui:
  // https://ai.google.dev/gemini-api/docs/models
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  try {
    const { messages } = req.body;
    const recent = (messages || []).slice(-10);

    const systemPrompt = `Sei Meridian, l'assistente AI di un sito di informazione finanziaria.
Rispondi SEMPRE in italiano, in modo chiaro e diretto, a domande su notizie, mercati, azioni, forex e criptovalute.
Puoi spiegare dinamiche di mercato, contesto storico e ragionamenti generali.
Non sei un consulente finanziario autorizzato: non dare mai istruzioni operative dirette del tipo "compra" o "vendi",
ma aiuta l'utente a capire la situazione e i fattori in gioco, ricordando quando serve che non è consulenza personalizzata.
Se non hai informazioni aggiornate su un evento specifico, dillo onestamente invece di inventare numeri.`;

    // Gemini vuole i ruoli come "user" e "model" (non "assistant")
    const contents = recent.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Gemini API error:', data.error);
      return res.status(200).json({
        reply: `L'assistente non è riuscito a rispondere. Dettaglio errore: ${data.error.status || ''} — ${data.error.message || 'sconosciuto'}`
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n') ||
      'Non sono riuscito a generare una risposta, riprova con un\'altra domanda.';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      reply: 'Si è verificato un errore imprevisto. Riprova tra poco.'
    });
  }
}
