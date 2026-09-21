# NFC Tool

PWA per lettura, scrittura e formattazione NDEF di tag NFC, basata sulla Web NFC API.

## Uso

App online: https://nekostark.github.io/nfc-manager/

| Comando | Cosa fa |
| --- | --- |
| Leggi | Legge il messaggio NDEF del primo tag avvicinato |
| Scrivi | Chiede un testo e lo scrive sul tag |
| Scrivi da QR | Accende la fotocamera e legge un QR; il valore appare a schermo |
| Scrivi sul tag | Compare dopo la lettura del QR: scrive quel valore sul tag |
| Formatta | Formatta il tag in NDEF cancellandone il contenuto |

In "Scrivi da QR" un QR che contiene un URL `http`/`https` viene scritto come
record NDEF `url`, così toccando il tag il telefono apre direttamente il link;
qualsiasi altro contenuto diventa un record `text`.

La scrittura è divisa in due tocchi di proposito. Chrome arma il lettore NFC
per un'operazione che nasce da un gesto dell'utente, e i secondi passati a
inquadrare il QR consumano quello del tocco iniziale: se la scrittura partisse
da sola alla fine della scansione resterebbe appesa, il tag verrebbe
intercettato da Android e l'app sembrerebbe in attesa senza esserlo. Il secondo
tocco fa anche vedere cosa si sta per scrivere prima di sovrascrivere il tag.

Requisiti: Chrome/Edge su Android con NFC attivo. La Web NFC API non è disponibile
su iOS né sui browser desktop, e richiede un contesto sicuro (HTTPS), garantito da
GitHub Pages. La scansione QR usa l'API `BarcodeDetector` del browser (nessuna
libreria, niente da scaricare) e richiede il permesso di accesso alla fotocamera.

L'app è installabile (Aggiungi a schermata Home) e funziona offline grazie al
service worker.

## Sviluppo locale

Serve un web server (il service worker non funziona con `file://`):

```sh
python3 -m http.server 8000
```

Poi apri http://localhost:8000 — `localhost` è considerato contesto sicuro.

Dopo una modifica ai file, incrementa `CACHE_NAME` in `sw.js` per invalidare la cache.

## Stile

L'interfaccia usa [water.css](https://github.com/kognise/water.css) v2.1.1 (MIT),
un foglio di stile *classless*: dà forma all'HTML semantico senza bisogno di
classi nel markup.

`app.css` è l'unico foglio di stile del progetto: contiene water.css seguito
dalle personalizzazioni di questa app (colori allineati al tema, barra dei
comandi, anteprima della fotocamera, blocco di output). Il separatore a metà
file segna il confine fra le due parti.

Non è caricato da CDN di proposito: un foglio esterno non entrerebbe nella cache
del service worker e offline l'app si aprirebbe senza stili.

Per aggiornare water.css: sostituisci la parte prima del separatore con il
contenuto di `https://cdn.jsdelivr.net/npm/water.css@2/out/water.min.css`,
tenendo l'intestazione con la licenza MIT, e incrementa `CACHE_NAME` in `sw.js`.

## Deploy

Ogni push su `main` pubblica automaticamente la root del repository su GitHub Pages
tramite `.github/workflows/deploy-pages.yml`.
