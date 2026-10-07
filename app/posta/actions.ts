"use server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { runAgent } from "@/lib/agent/agent";
import { proposalSchema } from "@/lib/agent/schema";
import { getEmail, TODAY } from "@/lib/queries";

const { emails, orders, orderLines, orderEvents, products, agentRuns, customers } = schema;

export async function analyzeEmail(id: number): Promise<{ error?: string }> {
  const email = getEmail(id);
  if (!email) return { error: "Email non trovata" };
  const t0 = Date.now();
  try {
    const res = await runAgent(email);
    db.update(emails).set({ state: "proposta", proposalJson: JSON.stringify(res.proposal) }).where(eq(emails.id, id)).run();
    db.insert(agentRuns).values({
      emailId: id, mode: res.mode, model: res.model, stepsJson: JSON.stringify(res.steps),
      startedAt: new Date(t0).toISOString(), durationMs: Date.now() - t0,
    }).run();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore dell'agente" };
  }
  revalidatePath("/posta");
  return {};
}

// Unico punto in cui nasce un ordine: dopo conferma umana, con la proposta eventualmente corretta.
export async function confirmProposal(id: number, edited: unknown): Promise<{ order?: number; error?: string }> {
  const parsed = proposalSchema.safeParse(edited);
  if (!parsed.success) return { error: "Proposta non valida" };
  const p = parsed.data;
  if (p.intent !== "nuovo_ordine" || p.lines.length === 0 || !p.customer) return { error: "Niente da creare: la bozza non contiene righe d'ordine." };
  const prods = Object.fromEntries(db.select().from(products).all().map((x) => [x.id, x]));
  if (p.lines.some((l) => !prods[l.productId])) return { error: "Prodotto non in catalogo" };

  const lead = Math.max(...p.lines.map((l) => prods[l.productId].leadDays));
  const d = new Date(); d.setDate(d.getDate() + lead);
  const promised = d.toISOString().slice(0, 10);

  const known = db.select().from(customers).where(eq(customers.name, p.customer)).get();
  const o = db.insert(orders).values({
    customer: p.customer, agent: p.agent ?? known?.agent ?? null, channel: p.channel ?? known?.channel ?? "Squadra",
    status: "ricevuto", promisedDate: promised, sourceEmailId: id, notes: p.doubts.join(" | ") || null,
  }).returning().get();
  db.insert(orderLines).values(p.lines.map((l) => ({ orderNumber: o.number, productId: l.productId, qty: l.qty, customization: l.customization }))).run();
  db.insert(orderEvents).values({ orderNumber: o.number, status: "ricevuto", at: TODAY(), note: `Creato da email #${id} (agente AI + conferma umana)` }).run();
  db.update(emails).set({ state: "ordine_creato", orderNumber: o.number }).where(eq(emails.id, id)).run();
  revalidatePath("/"); revalidatePath("/posta");
  return { order: o.number };
}

export async function discardEmail(id: number) {
  db.update(emails).set({ state: "scartata" }).where(eq(emails.id, id)).run();
  revalidatePath("/posta");
}

export async function resetEmail(id: number) {
  db.update(emails).set({ state: "nuova", proposalJson: null }).where(eq(emails.id, id)).run();
  revalidatePath("/posta");
}
