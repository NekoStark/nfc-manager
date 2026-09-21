# NFC Tool

PWA per lettura, scrittura e formattazione NDEF di tag NFC, basata sulla Web NFC API.

## Uso

App online: https://nekostark.github.io/nfc-manager/

Requisiti: Chrome/Edge su Android con NFC attivo. La Web NFC API non è disponibile
su iOS né sui browser desktop, e richiede un contesto sicuro (HTTPS), garantito da
GitHub Pages.

L'app è installabile (Aggiungi a schermata Home) e funziona offline grazie al
service worker.

## Sviluppo locale

Serve un web server (il service worker non funziona con `file://`):

```sh
python3 -m http.server 8000
```

Poi apri http://localhost:8000 — `localhost` è considerato contesto sicuro.

Dopo una modifica ai file, incrementa `CACHE_NAME` in `sw.js` per invalidare la cache.

## Deploy

Ogni push su `main` pubblica automaticamente la root del repository su GitHub Pages
tramite `.github/workflows/deploy-pages.yml`.
