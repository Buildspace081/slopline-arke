import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder, getEvents } from "@/lib/queries";
import { STATUS, PHASES, NEXT, type StatusKey } from "@/lib/status";
import { StatusBadge } from "@/components/Badge";
import { setStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const order = getOrder(Number(n));
  if (!order) notFound();
  const events = getEvents(order.number);
  const phase = STATUS[order.status as StatusKey].phase;
  const next = NEXT[order.status as StatusKey];
  return (
    <div className="space-y-5">
      <Link href="/" className="text-sm text-[#1f6f8b] underline">← Tutti gli ordini</Link>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">Ordine {order.number} · {order.customer}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-slate-500">{order.channel} · {order.agent ?? "nessun agente"} · consegna promessa {order.promisedDate}{order.sourceEmailId ? ` · da email #${order.sourceEmailId}` : ""}</p>
        <div className="mt-4 flex gap-1">
          {PHASES.map((p, i) => <div key={p} className={`flex-1 rounded px-2 py-1.5 text-center text-xs font-semibold ${i === phase ? "bg-[#1f6f8b] text-white" : i < phase ? "bg-sky-100 text-sky-900" : "bg-slate-100 text-slate-400"}`}>{p}</div>)}
        </div>
        <ul className="mt-4 list-disc pl-5 text-sm">
          {order.lines.map((l) => <li key={l.id}>{l.qty} × {l.product.code} {l.product.name}{l.customization ? <span className="text-slate-500"> — {l.customization}</span> : null}</li>)}
        </ul>
        {order.notes && <p className="mt-3 rounded bg-amber-50 p-3 text-sm text-amber-900"><b>Note dell&apos;agente:</b> {order.notes}</p>}
        {next && (
          <form action={setStatus.bind(null, order.number, next)} className="mt-4">
            <button className="rounded bg-[#1f6f8b] px-4 py-2 text-sm font-semibold text-white">Avanza a: {STATUS[next].label}</button>
          </form>
        )}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-bold">Storico</h2>
        <ul className="space-y-1 text-sm">
          {events.map((e) => <li key={e.id}><span className="font-mono text-slate-500">{e.at}</span> · {STATUS[e.status as StatusKey]?.label ?? e.status}{e.note ? <span className="text-slate-500"> — {e.note}</span> : null}</li>)}
        </ul>
      </div>
    </div>
  );
}
