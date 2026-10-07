import { z } from "zod";

// Contratto di uscita dell'agente: la "bozza" che un umano deve confermare.
export const proposalSchema = z.object({
  intent: z.enum(["nuovo_ordine", "richiesta_stato", "richiesta_preventivo", "altro"]).describe("Che cosa vuole il mittente"),
  summary: z.string().describe("Una frase in italiano su cosa chiede il mittente"),
  customer: z.string().nullable().describe("Nome cliente come in anagrafica, se noto"),
  customerKnown: z.boolean().describe("true solo se il cliente esiste in anagrafica"),
  agent: z.string().nullable(),
  channel: z.enum(["Squadra", "Online", "Conto terzi"]).nullable(),
  lines: z.array(z.object({
    productId: z.string().describe("id prodotto da catalogo (es. pro, lite, sal, gil, calc)"),
    qty: z.number().int().positive().describe("quantita; se incerta usa la stima piu' prudente"),
    customization: z.string().nullable().describe("logo, colori, grafica richiesta"),
  })),
  requestedDate: z.string().nullable().describe("data richiesta in forma ISO AAAA-MM-GG se deducibile"),
  doubts: z.array(z.string()).describe("Punti incerti o mancanti che un umano deve controllare"),
  relatedOrderNumber: z.number().int().nullable().describe("numero ordine esistente se la mail riguarda un ordine in corso"),
  replyDraft: z.string().nullable().describe("bozza di risposta al mittente, se utile"),
  confidence: z.enum(["alta", "media", "bassa"]),
});
export type Proposal = z.infer<typeof proposalSchema>;

export type AgentStep = { type: "tool" | "note"; name?: string; input?: unknown; output?: unknown; text?: string };
export type AgentResult = { proposal: Proposal; steps: AgentStep[]; mode: "live" | "mock"; model: string };
