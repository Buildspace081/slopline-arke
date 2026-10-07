import { sqlite, DDL } from "../lib/db";
import { db, schema } from "../lib/db";

// Dati interamente fittizi: nomi, clienti, quantita e date sono inventati per la demo.
const { products, materials, customers, orders, orderLines, orderEvents, emails } = schema;

sqlite.exec(
  "DROP TABLE IF EXISTS agent_runs; DROP TABLE IF EXISTS emails; DROP TABLE IF EXISTS order_events; DROP TABLE IF EXISTS order_lines; DROP TABLE IF EXISTS orders; DROP TABLE IF EXISTS customers; DROP TABLE IF EXISTS materials; DROP TABLE IF EXISTS products;",
);
sqlite.exec(DDL);

db.insert(materials).values([
  { id: "lycra", code: "TES-LY", name: "Tessuto lycra", qty: 420, minStock: 150, location: "Scaffale A1" },
  { id: "traforato", code: "TES-TR", name: "Tessuto leggero", qty: 0, minStock: 80, location: "Scaffale A2" },
  { id: "salopette", code: "TES-SA", name: "Tessuto salopette", qty: 95, minStock: 100, location: "Scaffale B1" },
  { id: "antivento", code: "TES-AV", name: "Tessuto antivento", qty: 160, minStock: 60, location: "Scaffale B2" },
  { id: "poliestere", code: "TES-PC", name: "Poliestere calcio", qty: 900, minStock: 300, location: "Scaffale C1" },
]).run();

db.insert(products).values([
  { id: "pro", code: "MCP-01", name: "Maglia ciclismo Pro", price: 58, leadDays: 35, materialId: "lycra" },
  { id: "lite", code: "MCL-02", name: "Maglia ciclismo leggera", price: 52, leadDays: 35, materialId: "traforato" },
  { id: "sal", code: "SAL-03", name: "Salopette ciclismo", price: 74, leadDays: 40, materialId: "salopette" },
  { id: "gil", code: "GIL-04", name: "Gilet antivento", price: 46, leadDays: 30, materialId: "antivento" },
  { id: "calc", code: "MCA-05", name: "Maglia calcio", price: 24, leadDays: 30, materialId: "poliestere" },
]).run();

db.insert(customers).values([
  { name: "Team Pedale Rosso", email: "ordini@pedalerosso.example", agent: "Capo commerciale", channel: "Squadra" },
  { name: "GS Montagna Bike", email: "segreteria@montagnabike.example", agent: "Agente Centro", channel: "Squadra" },
  { name: "Atletico Esempio", email: "magazzino@atleticoesempio.example", agent: "Capo commerciale", channel: "Conto terzi" },
  { name: "Ciclo Club Lago", email: "info@cicloclublago.example", agent: "Agente Nord", channel: "Squadra" },
  { name: "Azienda Esempio", email: "hr@aziendaesempio.example", agent: "Agente Estero", channel: "Squadra" },
  { name: "Team Strada Bianca", email: "team@stradabianca.example", agent: "Capo commerciale", channel: "Squadra" },
  { name: "Ciclo Valle", email: "amministrazione@ciclovalle.example", agent: "Agente Nord", channel: "Squadra" },
  { name: "Velo Club Collina", email: "presidente@veloclubcollina.example", agent: "Agente Centro", channel: "Squadra" },
]).run();

type Seed = { customer: string; agent: string | null; channel: string; status: string; lines: [string, number][]; history: [string, string][] };
const seed: Seed[] = [
  { customer: "Team Pedale Rosso", agent: "Capo commerciale", channel: "Squadra", status: "calandra", lines: [["pro", 30], ["sal", 30]], history: [["ricevuto", "2026-08-04"], ["grafica", "2026-08-05"], ["cliente", "2026-08-08"], ["approvato", "2026-08-20"], ["stampa", "2026-09-24"], ["calandra", "2026-09-29"]] },
  { customer: "GS Montagna Bike", agent: "Agente Centro", channel: "Squadra", status: "cliente", lines: [["pro", 25]], history: [["ricevuto", "2026-08-18"], ["grafica", "2026-08-19"], ["cliente", "2026-08-23"]] },
  { customer: "Atletico Esempio", agent: "Capo commerciale", channel: "Conto terzi", status: "assemblaggio", lines: [["calc", 200]], history: [["ricevuto", "2026-08-25"], ["approvato", "2026-08-26"], ["stampa", "2026-09-08"], ["calandra", "2026-09-12"], ["assemblaggio", "2026-09-16"]] },
  { customer: "Vendite online · settimana 39", agent: null, channel: "Online", status: "stampa", lines: [["gil", 14], ["pro", 9]], history: [["ricevuto", "2026-09-28"], ["approvato", "2026-09-28"], ["stampa", "2026-10-02"]] },
  { customer: "Ciclo Club Lago", agent: "Agente Nord", channel: "Squadra", status: "materiali", lines: [["sal", 120]], history: [["ricevuto", "2026-09-22"], ["grafica", "2026-09-22"], ["cliente", "2026-09-24"], ["materiali", "2026-09-30"]] },
  { customer: "Azienda Esempio", agent: "Agente Estero", channel: "Squadra", status: "grafica", lines: [["gil", 50]], history: [["ricevuto", "2026-09-30"], ["grafica", "2026-10-01"]] },
  { customer: "Team Strada Bianca", agent: "Capo commerciale", channel: "Squadra", status: "spedito", lines: [["pro", 18]], history: [["ricevuto", "2026-07-20"], ["approvato", "2026-07-21"], ["stampa", "2026-08-25"], ["calandra", "2026-08-27"], ["assemblaggio", "2026-08-29"], ["pronto", "2026-09-10"], ["spedito", "2026-09-11"]] },
];
const leadOf = Object.fromEntries(db.select().from(products).all().map((p) => [p.id, p.leadDays]));
const addDays = (iso: string, n: number) => { const d = new Date(iso); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

// Numeri d'ordine partono da 128 come nella demo.
sqlite.prepare("INSERT INTO sqlite_sequence(name, seq) VALUES ('orders', 127)").run();
for (const s of seed) {
  const lead = Math.max(...s.lines.map(([p]) => leadOf[p]));
  const o = db.insert(orders).values({ customer: s.customer, agent: s.agent, channel: s.channel, status: s.status, promisedDate: addDays(s.history[0][1], lead) }).returning().get();
  db.insert(orderLines).values(s.lines.map(([productId, qty]) => ({ orderNumber: o.number, productId, qty }))).run();
  db.insert(orderEvents).values(s.history.map(([status, at]) => ({ orderNumber: o.number, status, at }))).run();
}

const now = (h: number, m: number) => `2026-10-06T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
db.insert(emails).values([
  {
    channel: "email", fromName: "Marta Rinaldi · Ciclo Valle", fromAddress: "amministrazione@ciclovalle.example",
    subject: "Ordine maglie per la stagione 2027", receivedAt: now(8, 12),
    body: `Buongiorno,\n\nvi confermo l'ordine di 40 maglie ciclismo leggere (modello MCL-02) per la nostra squadra, come concordato con il vostro agente del Nord. Il logo e' lo stesso dell'anno scorso, vi giro il file in un altro messaggio. Ci servirebbero per meta' dicembre.\n\nGrazie e buon lavoro,\nMarta Rinaldi\nCiclo Valle`,
  },
  {
    channel: "email", fromName: "Luca Bernardi · Team Pedale Rosso", fromAddress: "ordini@pedalerosso.example",
    subject: "Riordino nuovi tesserati", receivedAt: now(9, 3),
    body: `Ciao Pietro,\n\nabbiamo 12 nuovi tesserati. Come l'ordine di agosto servono per ognuno: 1 salopette e 1 maglia Pro, stessa grafica di agosto (quella con la banda rossa). Taglie in allegato tabella:\n\nS: 2\nM: 5\nL: 4\nXL: 1\n\nSe riuscite entro Natale e' perfetto.\nLuca`,
  },
  {
    channel: "whatsapp-audio", fromName: "Giorgio (presidente Velo Club Collina)", fromAddress: "+39 333 000 0000",
    subject: "Audio WhatsApp · 0:42", receivedAt: now(11, 40),
    body: `[trascrizione automatica] Ciao Arianna, sono Giorgio del Velo Club Collina. Volevamo rifare le divise per tutti i soci, direi le maglie Pro e le salopette. Siamo in tipo trentacinque, quaranta persone, devo ancora contare bene. Come l'anno scorso con i colori verde e bianco. Fammi sapere quanto viene e per quando e' pronto.`,
  },
  {
    channel: "email", fromName: "Ufficio acquisti · Atletico Esempio", fromAddress: "magazzino@atleticoesempio.example",
    subject: "Produzione conto terzi: 200 maglie calcio", receivedAt: now(14, 5),
    body: `Buonasera,\n\nconfermiamo la produzione di 200 maglie da calcio (vostro codice MCA-05) con il nostro file grafico gia' inviato lunedi. Marchio nostro, nessun logo SLOPLINE sul capo. Consegna richiesta entro il 20 novembre.\n\nCordiali saluti\nUfficio acquisti`,
  },
  {
    channel: "email", fromName: "Segreteria · GS Montagna Bike", fromAddress: "segreteria@montagnabike.example",
    subject: "A che punto e' il nostro ordine?", receivedAt: now(15, 22),
    body: `Buongiorno, volevamo sapere a che punto e' l'ordine delle 25 maglie Pro. Il presidente ci chiede quando arrivano perche' abbiamo la gara sociale a novembre. Grazie.`,
  },
  {
    channel: "email", fromName: "Paola Neri · Azienda Esempio", fromAddress: "hr@aziendaesempio.example",
    subject: "Richiesta preventivo giacche invernali", receivedAt: now(16, 48),
    body: `Buongiorno,\n\nvorremmo 30 giacche invernali termiche con il logo aziendale per i dipendenti del reparto trasporti. Potete farci un preventivo? Ci servono per gennaio.\n\nPaola Neri`,
  },
]).run();

console.log("Seed completato: ordini", db.select().from(orders).all().length, "email", db.select().from(emails).all().length);
