# Dati e backend — SLOPLINE × Arke

## Stato attuale

Backend locale: SQLite su file (`data/arke.db`) tramite Drizzle, creato da `lib/db/index.ts`, popolato da `npm run seed`. Nessun servizio condiviso, nessuna autenticazione.

## Dati e proprieta'

| Dato | Origine | Proprietario | Dove vive | Conservazione/eliminazione |
| --- | --- | --- | --- | --- |
| Catalogo, materiali, clienti, ordini, email | Inventati nel seed (nessun dato reale) | Gennaro Basile | `data/arke.db` | `npm run seed` ricrea tutto; il file non e' tracciato da git |
| Bozze e run dell'agente | Generati dall'agente | Gennaro Basile | tabelle `emails.proposal_json`, `agent_runs` | stessa regola |

Prima di usare dati reali di SLOPLINE: definire proprietario, base giuridica e conservazione con il cliente. Da decidere.

## Accessi e integrazioni

- Autenticazione: Non applicabile (prototipo).
- Autorizzazione: Non applicabile. Previsti ruoli (ufficio, grafica, produzione, direzione) nella fase successiva.
- Servizi esterni: Vercel AI Gateway per il modello; invia il testo delle email al provider. Con dati reali serve accordo sui dati e valutazione di zero data retention.
- API/contratti: server actions in `app/posta/actions.ts` e `app/ordini/actions.ts`; nessuna API pubblica.

## Ambienti e operativita'

- Separazione ambienti: solo locale.
- Migrazioni: oggi `CREATE TABLE IF NOT EXISTS` + seed distruttivo. Da sostituire con migrazioni Drizzle prima del Postgres.
- Backup e ripristino: non necessari (dati fittizi riproducibili).
- Esportazione ed eliminazione: eliminare `data/arke.db`.
- Osservabilita': tabella `agent_runs`.

## Configurazione

Variabili in `.env.example`.

## Decisioni aperte

- Postgres in produzione (Neon via Marketplace Vercel): responsabile Gennaro, prima di qualsiasi demo condivisa online.
