import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { listEmails, getEmail } from "@/lib/queries";
import { ProposalPanel } from "@/components/ProposalPanel";
import type { Proposal, AgentStep } from "@/lib/agent/schema";

export const dynamic = "force-dynamic";

const STATE: Record<string, string> = { nuova: "Nuova", proposta: "Bozza pronta", ordine_creato: "Ordine creato", scartata: "Scartata" };

export default async function Posta({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const sp = await searchParams;
  const list = listEmails();
  const selected = getEmail(Number(sp.id ?? list[list.length - 1]?.id)) ?? list[0];
  const run = selected ? db.select().from(schema.agentRuns).where(eq(schema.agentRuns.emailId, selected.id)).orderBy(desc(schema.agentRuns.id)).get() : undefined;
  const catalog = db.select().from(schema.products).all();
  return (
    <div className="grid gap-5 md:grid-cols-[320px_1fr]">
      <aside className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50 p-3 text-xs font-semibold uppercase text-slate-500">Posta in arrivo · ordini@slopline.example</div>
        <ul>
          {list.map((m) => (
            <li key={m.id}>
              <Link href={`/posta?id=${m.id}`} className={`block border-b border-slate-100 p-3 hover:bg-slate-50 ${selected?.id === m.id ? "bg-sky-50" : ""}`}>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{m.channel === "whatsapp-audio" ? "🎙️ WhatsApp" : "✉️ Email"}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5">{STATE[m.state]}</span>
                </div>
                <div className="mt-1 truncate text-sm font-semibold">{m.subject}</div>
                <div className="truncate text-xs text-slate-500">{m.fromName}</div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      {selected && (
        <section className="space-y-4">
          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h1 className="text-lg font-bold">{selected.subject}</h1>
            <p className="text-sm text-slate-500">{selected.fromName} · {selected.fromAddress} · {selected.receivedAt.replace("T", " ").slice(0, 16)}</p>
            <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed">{selected.body}</pre>
          </article>
          <ProposalPanel
            key={`${selected.id}-${selected.state}-${run?.id ?? 0}`}
            emailId={selected.id}
            state={selected.state}
            proposal={selected.proposalJson ? (JSON.parse(selected.proposalJson) as Proposal) : null}
            orderNumber={selected.orderNumber}
            run={run ? { mode: run.mode, model: run.model, durationMs: run.durationMs, steps: JSON.parse(run.stepsJson) as AgentStep[] } : null}
            catalog={catalog.map((c) => ({ id: c.id, code: c.code, name: c.name }))}
          />
        </section>
      )}
    </div>
  );
}
