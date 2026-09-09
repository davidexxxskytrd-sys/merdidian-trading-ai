# Meridian — guida per mettere online il sito (nessuna esperienza richiesta)

Questo pacchetto contiene un sito completo con:
- una pagina con notizie e prezzi di mercato
- un assistente AI con cui l'utente può chattare

Segui questi passaggi nell'ordine. Non serve scrivere codice, solo copiare/incollare.

## 1. Crea un account GitHub (gratis)
Vai su https://github.com e crea un account. Poi crea un nuovo "repository" (pulsante verde "New"),
dagli un nome (es. `meridian-trading-ai`) e caricaci dentro TUTTI i file di questa cartella
(trascinali nella pagina del repository con "Add file" → "Upload files").

## 2. Crea un account Vercel (gratis) e collega il sito
Vai su https://vercel.com, registrati (puoi usare lo stesso account GitHub per accedere).
Poi clicca "Add New" → "Project", scegli il repository che hai appena caricato e premi "Deploy".
Dopo un paio di minuti il sito sarà online con un indirizzo tipo `meridian-trading-ai.vercel.app`.

A questo punto il sito FUNZIONA GIÀ (notizie e prezzi mostreranno un messaggio di attesa,
e la chat dirà che va ancora configurata). I prossimi passi attivano tutto.

## 3. Attiva l'assistente AI (obbligatorio)
1. Vai su https://console.anthropic.com e crea un account.
2. Nella sezione "API Keys", crea una nuova chiave e copiala (inizia con `sk-ant-...`).
   Anthropic dà crediti gratuiti iniziali per iniziare a fare test.
3. Torna su Vercel, apri il tuo progetto → "Settings" → "Environment Variables".
4. Aggiungi una variabile chiamata `ANTHROPIC_API_KEY` e incolla la chiave come valore. Salva.
5. Vai su "Deployments" e rilancia l'ultimo deploy ("Redeploy") perché la modifica abbia effetto.

Da questo momento la chat risponderà davvero.

## 4. Attiva le notizie (facoltativo ma consigliato)
1. Vai su https://newsapi.org/register e crea un account gratuito.
2. Copia la tua API key.
3. Su Vercel, aggiungi una variabile d'ambiente `NEWS_API_KEY` con quel valore (stesso procedimento del punto 3).
4. Redeploy.

Nota: il piano gratuito di NewsAPI ha un limite di richieste giornaliere, sufficiente per iniziare.

## 5. Attiva i prezzi azionari (facoltativo)
I prezzi delle criptovalute (Bitcoin, Ethereum, Solana) funzionano già da subito, gratis, senza fare nulla.
Se vuoi aggiungere anche indici/azioni USA:
1. Vai su https://www.alphavantage.co/support/#api-key e ottieni una chiave gratuita.
2. Aggiungi su Vercel la variabile `ALPHA_VANTAGE_KEY`.
3. Redeploy.

Il piano gratuito ha un limite basso di richieste al minuto: va benissimo per iniziare,
ma se il sito cresce andrà aggiornato a un piano a pagamento più avanti.

## 6. Il tuo dominio personalizzato (facoltativo)
Su Vercel, "Settings" → "Domains" puoi collegare un dominio tuo (es. meridianmarkets.it)
se ne acquisti uno da un registrar come Namecheap o Register.it (a pagamento, in genere 10-15€/anno).

## Cosa fare quando il sito cresce
- Se hai molti visitatori, i costi dell'API di Claude e i limiti dei piani gratuiti
  (NewsAPI, Alpha Vantage, hosting Vercel) andranno rivisti: a quel punto conviene
  passare a piani a pagamento in base al traffico reale, non prima.
- Per la pubblicità: quando il sito ha contenuto e traffico regolare, richiedi
  l'attivazione di Google AdSense (gratuita) da https://www.google.com/adsense.

## Struttura dei file
- `index.html` — l'intero sito (struttura, stile, chat)
- `api/chat.js` — collega il sito all'AI di Claude, tenendo la chiave al sicuro
- `api/market.js` — recupera prezzi e notizie da fonti gratuite

Puoi sempre tornare da me se vuoi modificare i colori, aggiungere una sezione, cambiare
il tono delle risposte dell'assistente, o passare a più mercati/valute.
