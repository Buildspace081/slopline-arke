# Roadmap — SLOPLINE × Arke

## Adesso

- Obiettivo: prototipo dimostrabile «email → bozza dell'agente → ordine» con ordini fittizi.
- Criterio di completamento: i 6 messaggi del seed producono la bozza attesa in modalita' live, e l'ordine nasce solo dopo conferma.
- Responsabile: Gennaro Basile.
- Dipendenze: chiave `AI_GATEWAY_API_KEY` per la prova live (oggi solo mock verificato).

## Dopo

- Set di valutazione: 20-30 email con risposta attesa e punteggio di accuratezza su prodotto, quantita', cliente, dubbi.
- Vista materiali e blocco automatico per mancanza (come nella demo HTML).
- Deploy su Vercel con Postgres.

## Piu' avanti

- Casella email e WhatsApp reali, Shopify, Danea.
- Ruoli, vista grafica/produzione, cruscotto direzione, preventivi con data realistica.

## Fuori ambito

- Agente che scrive ordini senza conferma: scelta di sicurezza (decisione 0002).
