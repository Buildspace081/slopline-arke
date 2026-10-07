# 0001 - SQLite in locale, Postgres in produzione

- Data: 2026-10-07
- Stato: Accettata
- Responsabile: Gennaro Basile

## Contesto

Serve un database persistente per il prototipo senza account esterni e senza chiavi. Il deploy serverless non puo' usare un file SQLite.

## Opzioni considerate

- SQLite locale + Drizzle: zero configurazione, riproducibile con il seed; non adatto a un deploy online.
- Neon Postgres da subito: pronto per Vercel; richiede account e provisioning prima di vedere qualcosa.

## Decisione

SQLite per sviluppo e demo locale; Postgres (Neon, Marketplace Vercel) quando serve un link condiviso. Drizzle limita il costo del passaggio.

## Conseguenze

- Si parte subito. Prima del deploy vanno riscritti lo schema (`sqlite-core` → `pg-core`) e le query sincrone in asincrone.

## Verifica o revisione

Rivedere al primo deploy condiviso.
