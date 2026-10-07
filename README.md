# SLOPLINE × Arke — prototipo registro ordini con agente AI

Registro unico degli ordini per SLOPLINE (abbigliamento sportivo) e agente AI che legge la posta in arrivo e prepara la bozza d'ordine, che una persona conferma.

## Proprietario e confini

- Responsabile: Gennaro Basile (candidatura/pilota Arke).
- Repository: Da decidere.
- Stato: prototipo. Tutti i dati sono fittizi.
- Dentro il progetto: registro ordini con stati, casella email simulata, agente AI di estrazione con conferma umana, mini database di ordini/materiali/catalogo.
- Fuori dal progetto: integrazione reale con Danea, Shopify, posta e WhatsApp (fasi successive); login reale.

## Avvio locale

Prerequisiti: Node 20+ (testato con 24), npm.

```bash
npm install
npm run seed     # ricrea il database fittizio (data/arke.db)
npm run dev      # http://localhost:3000
```

Configurazione: copia `.env.example` in `.env.local`. Senza chiave AI usa `AGENT_MODE=mock` (demo offline, dichiarata nella UI). Con `GOOGLE_GENERATIVE_AI_API_KEY` (Google AI Studio, Gemini Flash, default `gemini-flash-latest`) o `AI_GATEWAY_API_KEY` l'agente chiama davvero il modello. Se `AGENT_MODE=mock` e' impostato, ha la precedenza: toglilo per usare il modello. Non inserire segreti nei commit.

## Verifica

```bash
npm run typecheck
npm run lint
npm run build
```

## Documentazione

- `docs/PROJECT_SETUP.md`: procedura del kit.
- `REQUIREMENTS.md`, `ARCHITECTURE.md`, `BACKEND.md`, `ROADMAP.md`, `AGENTS.md`.
- `docs/decisions/`: scelte rilevanti. `docs/HANDOFF.md`: stato corrente.
- `docs/slopline-presentazione.html`: la presentazione originale da cui nasce il prototipo.

## Ambienti e rilascio

- Sviluppo: locale, SQLite su file.
- Staging: Non applicabile.
- Produzione: Da decidere (Vercel + Postgres, vedi decisione 0001).
