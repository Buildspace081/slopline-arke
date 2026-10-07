import Link from "next/link";
import { listOrders, listMaterials } from "@/lib/queries";
import { StatusBadge } from "@/components/Badge";

export const dynamic = "force-dynamic";

export default function Home() {
  const all = listOrders();
  const open = all.filter((o) => o.status !== "spedito");
  const late = open.filter((o) => o.late);
  const blocked = open.filter((o) => o.status === "materiali" || o.status === "cliente");
  const lowStock = listMaterials().filter((m) => m.qty < m.minStock);
  const stats = [["Ordini aperti", open.length], ["In ritardo", late.length], ["Fermi (cliente o materiale)", blocked.length], ["Materiali sotto scorta", lowStock.length]];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([l, n]) => (
          <div key={l as string} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-3xl font-bold">{n}</div>
            <div className="text-sm text-slate-500">{l}</div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="p-3">N.</th><th>Cliente</th><th>Canale</th><th>Righe</th><th>Stato</th><th>Consegna promessa</th></tr>
          </thead>
          <tbody>
            {all.map((o) => (
              <tr key={o.number} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-mono"><Link className="text-[#1f6f8b] underline" href={`/ordini/${o.number}`}>{o.number}</Link></td>
                <td className="font-semibold">{o.customer}<div className="text-xs font-normal text-slate-500">{o.agent ?? "—"}</div></td>
                <td>{o.channel}</td>
                <td className="text-slate-600">{o.lines.map((l) => `${l.qty} × ${l.product.code}`).join(" + ")}</td>
                <td><StatusBadge status={o.status} /></td>
                <td className={o.late ? "font-semibold text-red-700" : ""}>{o.promisedDate}{o.late && " · in ritardo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
