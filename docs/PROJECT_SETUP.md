# Procedura standard per nuovi progetti

Questa guida accompagna i file di questa repository template. Il kit contiene documentazione operativa, non uno stack applicativo: ogni progetto sceglie tecnologie, infrastruttura e automazioni in base al proprio prodotto.

## Principio di base

Un repository rappresenta un prodotto con un proprietario, confini, ambienti e dati propri. I documenti devono descrivere il sistema reale. Scrivi `Da decidere` quando manca una scelta e `Non applicabile` quando una sezione non serve; non lasciare esempi fittizi come se fossero fatti.

Le fonti di verita hanno ruoli diversi:

| Documento | Domanda a cui risponde | Quando aggiornarlo |
| --- | --- | --- |
| `README.md` | Che cos'e il progetto e come lo avvio? | Cambiano scopo, setup o comandi |
| `AGENTS.md` | Come deve lavorare un agente qui? | Cambiano regole, vincoli o verifiche |
| `REQUIREMENTS.md` | Per chi, cosa e con quali criteri di successo? | Cambiano obiettivi o comportamento atteso |
| `ARCHITECTURE.md` | Come funziona il sistema e dove sono i confini? | Cambiano componenti o flussi |
| `BACKEND.md` | Chi possiede dati, auth e integrazioni? | Prima e dopo ogni modifica backend |
| `ROADMAP.md` | Cosa viene prima e cosa resta fuori? | Cambiano priorita o milestone |
| `docs/decisions/` | Perche abbiamo scelto questa soluzione? | Una decisione rilevante viene presa o sostituita |
| `docs/HANDOFF.md` | Qual e lo stato verificato oggi? | Dopo lavoro materiale o al passaggio di consegne |
| `CONTRIBUTING.md` | Come si propone e verifica una modifica? | Cambia il flusso di sviluppo |
| `SECURITY.md` | Come si segnalano vulnerabilita e gestiscono i segreti? | Cambiano canali o responsabilita |
| `.env.example` | Quali variabili servono senza mostrare segreti? | Cambia la configurazione |
| `docs/OPERATIONS.md` | Come rilascio, osservo e ripristino il servizio? | Cambiano ambienti o procedure |

`README.md` e la porta d'ingresso. Gli altri file contengono il dettaglio nel rispettivo ambito. Una decisione durevole va in `docs/decisions/`; `docs/HANDOFF.md` conserva solo stato e prossime azioni, senza diventare una cronaca infinita.

## Da zero

1. Su GitHub, usa `Use this template` per creare un repository dedicato. I file di questa repository saranno la base del nuovo progetto, inclusi quelli nascosti.
2. Definisci nome, proprietario, problema, utenti, risultato misurabile e confini in `README.md` e `REQUIREMENTS.md`. Indica cosa non rientra nella prima versione.
3. Descrivi il percorso utente principale e 2-5 criteri di accettazione osservabili. Usa `Da decidere` per ipotesi ancora da validare.
4. Scegli lo stack minimo e descrivi componenti, flussi, dipendenze esterne e ambienti in `ARCHITECTURE.md`. Se una scelta e difficile da invertire, registra una decisione numerata in `docs/decisions/`.
5. Prima di introdurre dati, auth, moduli, pagamenti o integrazioni, compila `BACKEND.md`: proprietario dei dati, accessi, ambienti, backup, migrazione ed eliminazione. Aggiungi i nomi delle variabili a `.env.example`, mai i valori reali.
6. Definisci in `CONTRIBUTING.md` comandi reali di sviluppo e verifica. Crea una CI minima che esegua le verifiche disponibili. Documenta deploy, rollback e contatti operativi in `docs/OPERATIONS.md` quando esiste un ambiente condiviso o di produzione.
7. Scrivi in `AGENTS.md` l'ordine di lettura, i vincoli del repository e le verifiche. Completa `ROADMAP.md` con la prossima milestone e `docs/HANDOFF.md` con stato e rischi verificati.
8. Esegui setup, test, lint e build pertinenti. Controlla diff, link interni, placeholder, file sensibili e coerenza tra documenti e codice. Poi effettua la prima consegna.

Per un prototipo senza backend, `BACKEND.md` deve dire esplicitamente che non esiste ancora. `SECURITY.md` puo essere breve, ma deve indicare un canale privato di segnalazione prima di rendere pubblico il repository. `LICENSE` e facoltativo e richiede una scelta esplicita del titolare.

## Adozione in un progetto esistente

Procedi un repository alla volta. Non sovrascrivere documenti gia presenti.

1. Leggi istruzioni locali, stato Git, README, manifest, configurazione, CI, deploy e codice dei flussi principali. Distingui cio che e osservato da cio che e dichiarato.
2. Fai un inventario: documenti presenti, lacune, duplicazioni, segreti, dipendenze esterne, proprietari di dati, ambienti e comandi di verifica.
3. Compila prima `README.md`, `REQUIREMENTS.md` e `ARCHITECTURE.md` sulla base delle evidenze. Segna le decisioni non ricostruibili come `Da confermare`, senza attribuire motivazioni inventate.
4. Aggiungi o aggiorna `BACKEND.md`, `.env.example`, `AGENTS.md`, decisioni e handoff. Integra i documenti esistenti conservando le regole utili e i vincoli specifici del prodotto.
5. Identifica i rischi reali e proponi una sequenza di miglioramenti in `ROADMAP.md`. Non cambiare architettura o provider solo per uniformare i documenti.
6. Esegui i comandi disponibili. Registra esiti e limiti nel resoconto finale e aggiorna `docs/HANDOFF.md`.

## Prompt per il tuo agente

Per un progetto nuovo:

```text
Leggi docs/PROJECT_SETUP.md e gli altri file documentali in questo repository. Compilali con fatti verificabili; chiedimi solo le decisioni di prodotto che non puoi inferire. Segna il resto come Da decidere. Definisci confini, utenti, flusso principale, criteri di accettazione, stack minimo, proprieta dei dati, ambienti e comandi di verifica. Non inserire segreti. Esegui le verifiche disponibili e riassumi decisioni aperte e prossimi passi.
```

Per un progetto esistente:

```text
Adotta la procedura di docs/PROJECT_SETUP.md in questo repository. Prima leggi le istruzioni locali, lo stato Git, i documenti e il codice. Fai un inventario delle lacune e aggiorna i file senza sovrascrivere decisioni o modifiche esistenti. Usa il kit come struttura, ma documenta il sistema reale; distingui osservazioni, ipotesi e decisioni da confermare. Verifica i comandi disponibili, controlla il diff per segreti e riporta risultati, rischi e decisioni aperte.
```

## Cadenza

- Per ogni modifica: aggiorna il documento proprietario del comportamento cambiato.
- Per una decisione strutturale: aggiungi un record in `docs/decisions/` e collega l'effetto in `ARCHITECTURE.md` o `BACKEND.md`.
- Prima di consegnare: esegui le verifiche pertinenti e aggiorna `docs/HANDOFF.md` se lo stato e cambiato.
- Ogni trimestre o a un cambio di fase: rimuovi istruzioni obsolete e verifica che il setup funzioni da un ambiente pulito.

## Riferimenti

- [GitHub: repository da template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)
- [GitHub: buone pratiche per repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories)
- [MADR: record delle decisioni](https://adr.github.io/madr/)
