import type { AgentResult, Proposal } from "./schema";

// Modalita' offline per la demo: risposte precalcolate sulle email fittizie del seed.
// Stesso contratto del ramo live (proposalSchema), ma NON e' un'estrazione reale: la UI lo dichiara.
const BY_SUBJECT: Record<string, Proposal> = {
  "Ordine maglie per la stagione 2027": {
    intent: "nuovo_ordine", summary: "Ciclo Valle conferma 40 maglie leggere MCL-02 con logo dell'anno scorso.",
    customer: "Ciclo Valle", customerKnown: true, agent: "Agente Nord", channel: "Squadra",
    lines: [{ productId: "lite", qty: 40, customization: "Logo come lo scorso anno (file in arrivo)" }],
    requestedDate: null,
    doubts: ["Il file del logo non e' ancora arrivato.", "Il tessuto leggero e' a zero in magazzino: l'ordine si bloccherebbe prima della stampa.", "Data 'meta' dicembre' non precisa: il lead time standard e' 35 giorni."],
    relatedOrderNumber: null, replyDraft: null, confidence: "media",
  },
  "Riordino nuovi tesserati": {
    intent: "nuovo_ordine", summary: "Team Pedale Rosso riordina 12 salopette e 12 maglie Pro con la grafica di agosto.",
    customer: "Team Pedale Rosso", customerKnown: true, agent: "Capo commerciale", channel: "Squadra",
    lines: [{ productId: "sal", qty: 12, customization: "Grafica ordine 128, banda rossa" }, { productId: "pro", qty: 12, customization: "Grafica ordine 128, banda rossa" }],
    requestedDate: "2026-12-24",
    doubts: ["La tabella taglie somma a 12: ok.", "Salopette: materiale al limite della scorta minima (95 su 100)."],
    relatedOrderNumber: 128, replyDraft: null, confidence: "alta",
  },
  "Audio WhatsApp · 0:42": {
    intent: "nuovo_ordine", summary: "Velo Club Collina vuole divise per tutti i soci, maglie Pro e salopette, circa 35-40 persone.",
    customer: "Velo Club Collina", customerKnown: true, agent: "Agente Centro", channel: "Squadra",
    lines: [{ productId: "pro", qty: 40, customization: "Colori verde e bianco, come l'anno scorso" }, { productId: "sal", qty: 40, customization: "Colori verde e bianco" }],
    requestedDate: null,
    doubts: ["Quantita' vaga ('tipo 35 o 40'): stima prudente 40, da confermare con Giorgio.", "Non e' chiaro se serve una salopette per ogni socio.", "Chiede un preventivo, non e' un ordine confermato: valutare se creare prima un preventivo."],
    relatedOrderNumber: null, replyDraft: null, confidence: "bassa",
  },
  "Produzione conto terzi: 200 maglie calcio": {
    intent: "nuovo_ordine", summary: "Atletico Esempio conferma 200 maglie da calcio MCA-05, marchio del cliente, consegna entro il 20 novembre.",
    customer: "Atletico Esempio", customerKnown: true, agent: "Capo commerciale", channel: "Conto terzi",
    lines: [{ productId: "calc", qty: 200, customization: "File grafico del cliente, nessun logo SLOPLINE" }],
    requestedDate: "2026-11-20",
    doubts: ["Lead time standard 30 giorni: la data del 20 novembre e' al limite."],
    relatedOrderNumber: null, replyDraft: null, confidence: "alta",
  },
  "A che punto e' il nostro ordine?": {
    intent: "richiesta_stato", summary: "GS Montagna Bike chiede lo stato dell'ordine di 25 maglie Pro.",
    customer: "GS Montagna Bike", customerKnown: true, agent: "Agente Centro", channel: "Squadra",
    lines: [], requestedDate: null,
    doubts: ["L'ordine e' fermo in attesa dell'approvazione del bozzetto da parte del cliente."],
    relatedOrderNumber: 129,
    replyDraft: "Buongiorno, l'ordine delle 25 maglie Pro e' in attesa della vostra approvazione del bozzetto. Appena ci confermate partiamo con la stampa. Per la gara di novembre conviene approvare il prima possibile.",
    confidence: "alta",
  },
  "Richiesta preventivo giacche invernali": {
    intent: "richiesta_preventivo", summary: "Azienda Esempio chiede un preventivo per 30 giacche invernali termiche con logo.",
    customer: "Azienda Esempio", customerKnown: true, agent: "Agente Estero", channel: "Squadra",
    lines: [], requestedDate: null,
    doubts: ["Le giacche invernali non sono nel catalogo ufficiale: serve valutazione commerciale.", "Non e' un ordine, nessuna riga creata."],
    relatedOrderNumber: null, replyDraft: null, confidence: "media",
  },
};

export function mockRun(email: { subject: string }): AgentResult {
  const proposal = BY_SUBJECT[email.subject];
  if (!proposal) throw new Error("Modalita' mock: nessuna risposta precalcolata per questa email.");
  return {
    proposal, mode: "mock", model: "mock",
    steps: [{ type: "note", text: "Modalita' demo offline: risposta precalcolata, nessuna chiamata al modello." }],
  };
}
