import { ToolLoopAgent, Output, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { agentTools } from "./tools";
import { proposalSchema, type AgentResult, type AgentStep } from "./schema";
import { mockRun } from "./mock";

// Provider in ordine di preferenza: Google AI Studio (chiave diretta) -> Vercel AI Gateway -> demo offline.
const hasGoogleKey = () => Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const hasGatewayKey = () => Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
export const modelName = () => process.env.AGENT_MODEL || (hasGoogleKey() ? "gemini-flash-latest" : "anthropic/claude-sonnet-4.5");

const INSTRUCTIONS = `Sei l'assistente dell'ufficio ordini di SLOPLINE, azienda di abbigliamento sportivo.
Ricevi un messaggio (email o trascrizione di audio WhatsApp) e prepari una BOZZA strutturata. Non crei ordini: li conferma una persona.

Regole:
- Usa sempre i tool per verificare prodotto, cliente e magazzino prima di rispondere. Non inventare codici o prezzi.
- Mappa i prodotti al catalogo ufficiale (searchCatalog). Se il prodotto richiesto non esiste, non forzare un'associazione: lascia lines vuoto e spiega in doubts.
- Se la quantita e' vaga ("tipo 35 o 40") usa la stima prudente e scrivilo in doubts.
- Se un ordine di piu' prodotti ha tabelle di taglie, la quantita' e' la somma per prodotto.
- Se la mail e' una richiesta di stato, usa listCustomerOrders, collega relatedOrderNumber e prepara replyDraft; non creare righe d'ordine.
- Se manca il materiale (checkStock) o il cliente non e' in anagrafica, segnalalo in doubts.
- Le date relative ("meta' dicembre") vanno in requestedDate solo se si deducono con sicurezza, altrimenti null e scrivilo in doubts.
- Rispondi in italiano. confidence=alta solo se tutto e' verificato e senza dubbi.`;

function buildAgent() {
  return new ToolLoopAgent({
    model: hasGoogleKey() ? google(modelName()) : modelName(),
    instructions: INSTRUCTIONS,
    tools: agentTools,
    output: Output.object({ schema: proposalSchema }),
    stopWhen: stepCountIs(8),
  });
}

export function liveAvailable() {
  return hasGoogleKey() || hasGatewayKey();
}

export async function runAgent(email: { fromName: string; fromAddress: string; subject: string; body: string; channel: string }): Promise<AgentResult> {
  const mode = process.env.AGENT_MODE ?? (liveAvailable() ? "live" : "none");
  if (mode === "mock") return mockRun(email);
  if (mode !== "live") {
    throw new Error("Agente non configurato: imposta GOOGLE_GENERATIVE_AI_API_KEY (oppure AI_GATEWAY_API_KEY) in .env.local, oppure AGENT_MODE=mock per la demo offline.");
  }
  const steps: AgentStep[] = [];
  const result = await buildAgent().generate({
    prompt: `Canale: ${email.channel}\nDa: ${email.fromName} <${email.fromAddress}>\nOggetto: ${email.subject}\n\n${email.body}`,
    onStepFinish: (s) => {
      for (const c of s.toolCalls ?? []) {
        const r = s.toolResults?.find((x) => x.toolCallId === c.toolCallId);
        steps.push({ type: "tool", name: c.toolName, input: c.input, output: r?.output });
      }
    },
  });
  return { proposal: result.output, steps, mode: "live", model: modelName() };
}
