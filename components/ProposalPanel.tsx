"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Proposal, AgentStep } from "@/lib/agent/schema";
import { analyzeEmail, confirmProposal, discardEmail, resetEmail } from "@/app/posta/actions";

type Props = {
  emailId: number; state: string; proposal: Proposal | null; orderNumber: number | null;
  run: { mode: string; model: string; durationMs: number; steps: AgentStep[] } | null;
  catalog: { id: string; code: string; name: string }[];
};

const INTENT: Record<string, string> = { nuovo_ordine: "Nuovo ordine", richiesta_stato: "Richiesta di stato", richiesta_preventivo: "Richiesta di preventivo", altro: "Altro" };

export function ProposalPanel({ emailId, state, proposal, orderNumber, run, catalog }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Proposal | null>(proposal);
  const name = (id: string) => catalog.find((c) => c.id === id);

  const act = (fn: () => Promise<{ error?: string } | void>) =>
    start(async () => { setError(null); const r = await fn(); if (r && r.error) setError(r.error); router.refresh(); });

  if (state === "ordine_creato")
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
        Ordine creato: <Link className="font-semibold underline" href={`/ordini/${orderNumber}`}>n. {orderNumber}</Link>.
        <button className="ml-3 underline" onClick={() => act(() => resetEmail(emailId))}>riporta a «nuova» (demo)</button>
      </div>
    );

  if (state === "nuova" || state === "scartata" || !proposal || !draft)
    return (
      <div className="space-y-2">
        <button disabled={pending} onClick={() => act(() => analyzeEmail(emailId))} className="rounded bg-[#1f6f8b] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {pending ? "L'agente sta leggendo…" : "Fai leggere all'agente AI"}
        </button>
        {state === "scartata" && <span className="ml-2 text-sm text-slate-500">scartata</span>}
        {error && <p className="rounded bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      </div>
    );

  const canCreate = draft.intent === "nuovo_ordine" && draft.lines.length > 0;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <b>{INTENT[draft.intent]}</b>
          <span className="rounded bg-white px-2 py-0.5 text-xs">confidenza {draft.confidence}</span>
          {run && <span className={`rounded px-2 py-0.5 text-xs ${run.mode === "mock" ? "bg-amber-100 text-amber-900" : "bg-white"}`}>{run.mode === "mock" ? "DEMO OFFLINE (risposta precalcolata)" : `${run.model} · ${(run.durationMs / 1000).toFixed(1)}s`}</span>}
        </div>
        <p className="mt-2 text-sm">{draft.summary}</p>
        <p className="mt-2 text-sm text-slate-600">Cliente: <b>{draft.customer ?? "—"}</b>{draft.customerKnown ? "" : " (non in anagrafica)"} · Agente: {draft.agent ?? "—"} · Canale: {draft.channel ?? "—"}{draft.requestedDate ? ` · Data richiesta: ${draft.requestedDate}` : ""}</p>
        {draft.relatedOrderNumber && <p className="mt-1 text-sm">Collegato all&apos;ordine <Link className="underline" href={`/ordini/${draft.relatedOrderNumber}`}>n. {draft.relatedOrderNumber}</Link></p>}
        {draft.lines.length > 0 && (
          <table className="mt-3 w-full bg-white text-sm">
            <tbody>
              {draft.lines.map((l, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="p-2 font-mono">{name(l.productId)?.code ?? l.productId}</td>
                  <td>{name(l.productId)?.name}</td>
                  <td className="w-24 p-1"><input type="number" min={1} value={l.qty} onChange={(e) => setDraft({ ...draft, lines: draft.lines.map((x, j) => (j === i ? { ...x, qty: Math.max(1, Number(e.target.value) || 1) } : x)) })} className="w-20 rounded border border-slate-300 px-2 py-1" aria-label="Quantità" /></td>
                  <td className="text-slate-500">{l.customization}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {draft.doubts.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <b>Da controllare a mano</b>
          <ul className="mt-1 list-disc pl-5">{draft.doubts.map((d, i) => <li key={i}>{d}</li>)}</ul>
        </div>
      )}
      {draft.replyDraft && <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm"><b>Bozza di risposta</b><p className="mt-1 whitespace-pre-wrap">{draft.replyDraft}</p></div>}

      {run && run.steps.length > 0 && (
        <details className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <summary className="cursor-pointer font-semibold">Cosa ha fatto l&apos;agente ({run.steps.length} passi)</summary>
          <ol className="mt-2 space-y-2">
            {run.steps.map((s, i) => (
              <li key={i} className="rounded bg-slate-50 p-2 font-mono text-xs">
                {s.type === "note" ? s.text : (<><b>{s.name}</b>({JSON.stringify(s.input)})<div className="mt-1 text-slate-500">→ {JSON.stringify(s.output).slice(0, 220)}</div></>)}
              </li>
            ))}
          </ol>
        </details>
      )}

      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <div className="flex gap-2">
        <button disabled={pending || !canCreate} onClick={() => act(() => confirmProposal(emailId, draft))} className="rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Conferma e crea ordine</button>
        <button disabled={pending} onClick={() => act(() => analyzeEmail(emailId))} className="rounded border border-slate-300 bg-white px-4 py-2 text-sm">Rianalizza</button>
        <button disabled={pending} onClick={() => act(() => discardEmail(emailId))} className="rounded border border-slate-300 bg-white px-4 py-2 text-sm">Scarta</button>
      </div>
    </div>
  );
}
