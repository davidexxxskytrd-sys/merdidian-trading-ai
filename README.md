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

## 3. Attiva l'assistente AI (obbligatorio) — con Gemini, gratis
1. Vai su https://aistudio.google.com (Google AI Studio) e accedi con un account Google.
2. Clicca "Get API key" → "Create API key" e copia la chiave che appare.
   Gemini ha un piano gratuito permanente (non solo credito di prova): niente carta di credito richiesta.
3. Torna su Vercel, apri il tuo progetto → "Settings" → "Environment Variables".
4. Aggiungi una variabile chiamata `GEMINI_API_KEY` e incolla la chiave come valore. Salva.
5. Vai su "Deployments" e rilancia l'ultimo deploy ("Redeploy") perché la modifica abbia effetto.

Da questo momento la chat risponderà davvero, gratuitamente (con un limite di richieste al minuto/giorno,
più che sufficiente per iniziare).

Nota: se in futuro ricevi un errore che dice che il modello non esiste più, vai su
https://ai.google.dev/gemini-api/docs/models per vedere il nome aggiornato, poi su Vercel
aggiungi una variabile `GEMINI_MODEL` con quel nome (es. `gemini-2.5-flash`) — non serve toccare il codice.

## 4. Attiva le notizie (facoltativo ma consigliato)
1. Vai su https://newsapi.org/register e crea un account gratuito.
2. Copia la tua API key.
3. Su Vercel, aggiungi una variabile d'ambiente `NEWS_API_KEY` con quel valore (stesso procedimento del punto 3).
4. Redeploy.

Nota: il piano gratuito di NewsAPI ha un limite di richieste giornaliere, sufficiente per iniziare.

## 5. Prezzi degli strumenti (già attivi, nessuna chiave richiesta)
Le 12 criptovalute nel catalogo (Bitcoin, Ethereum, Solana, ecc.) funzionano già gratis
senza configurare nulla, tramite CoinGecko. Non serve alcuna chiave per questa parte.

## 6. Il tuo dominio personalizzato (facoltativo)
Su Vercel, "Settings" → "Domains" puoi collegare un dominio tuo (es. meridianmarkets.it)
se ne acquisti uno da un registrar come Namecheap o Register.it (a pagamento, in genere 10-15€/anno).

## Cosa fare quando il sito cresce
- Se hai molti visitatori, i costi dell'API di Claude e i limiti dei piani gratuiti
  (NewsAPI, Alpha Vantage, hosting Vercel) andranno rivisti: a quel punto conviene
  passare a piani a pagamento in base al traffico reale, non prima.
- Per la pubblicità: quando il sito ha contenuto e traffico regolare, richiedi
  l'attivazione di Google AdSense (gratuita) da https://www.google.com/adsense.

## 6. Attiva forex, indici e materie prime (facoltativo)
Le criptovalute funzionano già gratis senza fare nulla. Per vedere anche cambio euro/dollaro,
S&P 500, oro, petrolio ecc. serve un'altra chiave gratuita:
1. Vai su https://twelvedata.com/pricing, scorri fino al piano "Free" e registrati.
2. Nella tua dashboard trovi l'API key: copiala.
3. Su Vercel, Settings → Environment Variables, aggiungi `TWELVEDATA_API_KEY` con quel valore.
4. Redeploy.

Il piano gratuito ha un limite di richieste (circa 800 al giorno, 8 al minuto): va benissimo per
un sito con pochi visitatori, ma se il traffico cresce andrà rivisto.

## Struttura dei file
- `index.html` — la home (strumenti personalizzabili, accesso AI in evidenza, notizie, banner Scuola del Trading)
- `chat.html` — la pagina dedicata all'assistente AI
- `school.html` — indice della Scuola del Trading
- `school-basi.html`, `school-forex.html`, `school-rischio.html` — i tre capitoli scritti finora
- `api/chat.js` — collega il sito a Gemini, tenendo la chiave al sicuro
- `api/instrument.js` — prezzo, variazione e storico delle criptovalute (CoinGecko, gratuito)
- `api/quote.js` — prezzo, variazione e storico di forex, indici e materie prime (Twelve Data)
- `api/market.js` — recupera le notizie economiche da NewsAPI

## Novità: strumenti personalizzabili, ora con più categorie
In home, ogni visitatore può cliccare "Personalizza" e scegliere fino a 5 strumenti tra
criptovalute, coppie forex (EUR/USD, GBP/USD, USD/JPY), indici (S&P 500, Nasdaq, Dow Jones)
e materie prime (oro, argento, petrolio). Le crypto funzionano gratis da subito; per le altre
categorie serve la chiave TWELVEDATA_API_KEY (punto 6 sopra).

## Novità: Scuola del Trading
In home, sotto la sezione notizie, c'è un banner che porta a `school.html`: l'indice dei
capitoli. Per ora sono scritti 3 capitoli (Le basi, Il Forex, Gestione del rischio), più
altri 3 mostrati come "in arrivo" per far vedere dove sta andando il progetto. Ogni capitolo
ha in fondo un pulsante che apre l'assistente con una domanda già pronta legata a
quell'argomento (usa il link tipo `chat.html?q=...`).

Quando vuoi aggiungere altri capitoli, basta copiare uno dei file `school-*.html` esistenti,
cambiare titolo e contenuto, e aggiungere una card nuova in `school.html`.

Puoi sempre tornare da me se vuoi modificare i colori, aggiungere una sezione, cambiare
il tono delle risposte dell'assistente, o passare a più mercati/valute.
