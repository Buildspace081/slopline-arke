# SLOPLINE × Arke - guida per agenti

## Avvio obbligatorio

1. Leggi `README.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md` e `docs/HANDOFF.md`.
2. Leggi `BACKEND.md` prima di toccare dati, auth, API, integrazioni o variabili d'ambiente.
3. Controlla `git status --short` e i commit recenti. Le modifiche esistenti appartengono all'utente.
4. Leggi i record in `docs/decisions/` prima di cambiare un confine architetturale.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js

Questa versione di Next.js ha cambiamenti rispetto a quella che conosci. Leggi la guida pertinente in `node_modules/next/dist/docs/` prima di scrivere codice e rispetta le deprecazioni. `cacheComponents` e' disattivato di proposito (pagine dinamiche su DB).
<!-- END:nextjs-agent-rules -->

## Confini del progetto

- Prodotto: prototipo registro ordini con agente AI per SLOPLINE; proprietario Gennaro Basile.
- Sistemi esterni: Vercel AI Gateway. Nient'altro e' collegato.
- Vincoli da non violare: solo dati fittizi; i tool dell'agente restano in sola lettura; un ordine nasce solo in `confirmProposal` dopo conferma umana; la modalita' mock va sempre dichiarata come tale nella UI.

## Sviluppo e consegna

- Verifica con `npm run typecheck`, `npm run lint`, `npm run build`. Non dichiarare superate verifiche non eseguite.
- Controlla il diff per segreti. `.env.local` e `data/*.db` non vanno committati.
- Aggiorna il documento proprietario quando cambia il comportamento e `docs/HANDOFF.md` dopo lavoro materiale.
- Registra in `docs/decisions/` le scelte difficili da invertire.

## Decisioni aperte

- Postgres e deploy online; proprietario dei dati reali.
