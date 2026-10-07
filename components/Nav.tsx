import Link from "next/link";
export function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
        <span className="text-lg font-extrabold tracking-tight text-[#1f6f8b]">SLOPLINE <span className="font-normal text-slate-400">× Arke</span></span>
        <nav className="flex gap-4 text-sm font-semibold text-slate-700">
          <Link href="/" className="hover:text-[#1f6f8b]">Ordini</Link>
          <Link href="/posta" className="hover:text-[#1f6f8b]">Posta &amp; agente AI</Link>
        </nav>
        <span className="ml-auto rounded bg-amber-50 px-2 py-1 text-xs text-amber-800">Prototipo · dati fittizi</span>
      </div>
    </header>
  );
}
