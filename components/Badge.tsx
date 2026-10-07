import { STATUS, type StatusKey } from "@/lib/status";
export function StatusBadge({ status }: { status: string }) {
  const tone = status === "materiali" ? "bg-red-100 text-red-800" : status === "cliente" ? "bg-amber-100 text-amber-800" : status === "pronto" || status === "spedito" ? "bg-green-100 text-green-800" : "bg-sky-100 text-sky-900";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>{STATUS[status as StatusKey]?.label ?? status}</span>;
}
