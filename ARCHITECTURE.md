# Architettura — SLOPLINE × Arke

## Stato

- Fase: implementata (prototipo).
- Ultima verifica con il codice: 2026-10-07 (typecheck, build, flusso email→ordine in modalita' mock; modalita' live non ancora provata, manca la chiave).

## Vista generale

Un'unica app Next.js (App Router). Le pagine server leggono da SQLite tramite Drizzle. La pagina «Posta» mostra email fittizie; il pulsante «Fai leggere all'agente» chiama una server action che esegue l'agente AI. L'agente restituisce una bozza strutturata (JSON validato con Zod) salvata sull'email. Solo la server action `confirmProposal`, chiamata dopo conferma umana, scrive ordine e righe.

```
Email/WhatsApp (seed) ──▶ server action analyzeEmail ──▶ ToolLoopAgent (AI SDK)
                                                         ├─ tool: searchCatalog
                                                         ├─ tool: findCustomer
                                                         ├─ tool: checkStock
                                                         └─ tool: listCustomerOrders
                                      bozza (proposalSchema) ◀─┘
bozza ──▶ UI: dubbi, quantita' modificabili ──▶ [umano] confirmProposal ──▶ ordine + storico
```

## Componenti e responsabilita'

| Componente | Responsabilita' | Posizione | Dipendenze |
| --- | --- | --- | --- |
| Schema e DB | Tabelle prodotti, materiali, clienti, ordini, righe, eventi, email, run dell'agente | `lib/db/` | better-sqlite3, Drizzle |
| Seed | Dati fittizi riproducibili | `scripts/seed.ts` | lib/db |
| Contratto agente | Schema della bozza (`proposalSchema`) e tipi dei passi | `lib/agent/schema.ts` | Zod |
| Tool dell'agente | Sola lettura su catalogo, clienti, magazzino, ordini | `lib/agent/tools.ts` | lib/db |
| Agente | Istruzioni, modello, loop con limite di 8 passi, uscita strutturata; provider: Google AI Studio, altrimenti AI Gateway | `lib/agent/agent.ts` | AI SDK, @ai-sdk/google, AI Gateway |
| Mock offline | Bozze precalcolate per le email del seed, dichiarate come demo | `lib/agent/mock.ts` | — |
| Azioni posta | Analisi, conferma (unica scrittura), scarto, reset | `app/posta/actions.ts` | agente, DB |
| UI | Lista ordini, scheda ordine, posta e pannello bozza | `app/`, `components/` | — |

## Flussi principali

1. L'utente apre un'email e preme «Fai leggere all'agente».
2. L'agente chiama i tool di lettura, produce la bozza; si salvano bozza e run (modalita', modello, passi, durata).
3. La UI mostra intento, righe, dubbi, confidenza e i passi dell'agente. L'utente corregge le quantita' e conferma o scarta.
4. In caso di errore (chiave mancante, modello non raggiungibile) la UI mostra il messaggio e non cambia nulla.

## Confini e integrazioni

- Sistemi esterni: Vercel AI Gateway (modello); in futuro Shopify, Danea, posta, WhatsApp. Nessuno e' collegato oggi.
- Confine di sicurezza dell'agente: tool in sola lettura, nessuna scrittura diretta, conferma umana obbligatoria.
- Contratti pubblici: `proposalSchema` in `lib/agent/schema.ts`.

## Ambienti e distribuzione

- Locale: `npm run dev`, SQLite in `data/arke.db`.
- Staging: Non applicabile.
- Produzione: Da decidere. SQLite su file non regge un deploy serverless: serve Postgres (decisione 0001).
- Build: `npm run build`.

## Qualita' e rischi

- Test ai confini: Da aggiungere (valutazione su un set di email con risposta attesa; vedi ROADMAP).
- Monitoraggio: ogni analisi salva modalita', modello, passi e durata in `agent_runs`.
- Rischi: l'agente puo' sbagliare quantita' o prodotto (mitigato da dubbi espliciti e conferma umana); prompt injection nel testo delle email (mitigato dai tool in sola lettura e dalla conferma; da testare).

## Decisioni correlate

- `docs/decisions/0001-sqlite-in-locale-postgres-in-produzione.md`
- `docs/decisions/0002-agente-bozza-con-conferma-umana.md`
