"use client";
import { useEffect, useState } from "react";
import AuthGuard from "../../components/auth-guard";
import { apiFetch } from "../../components/api";
function QueueInner() {
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({ queueType: "SOLO", region: "NA", partySize: 1 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { apiFetch("/auth/me").then((data) => setMe(data.user)).catch((err) => setError(err.message || "Failed to load user")); }, []);
  async function joinQueue(e) { e.preventDefault(); setError(""); setResult(null); try { const data = await apiFetch("/queue/join", { method: "POST", body: JSON.stringify({ userId: me.id, queueType: form.queueType, region: form.region, partySize: Number(form.partySize) }) }); setResult(data); } catch (err) { setError(err.message || "Queue join failed"); } }
  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-8"><div className="text-sm uppercase tracking-[0.22em] text-red-300">GamersOnline.gg</div><h1 className="mt-2 text-3xl font-black uppercase">Queue Join</h1><p className="mt-2 text-slate-300">Wired to the ranked queue endpoint.</p><form className="mt-6 space-y-4" onSubmit={joinQueue}><select className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" value={form.queueType} onChange={(e)=>setForm({...form,queueType:e.target.value})}><option value="SOLO">Solo</option><option value="DUO">Duo</option><option value="FIVE_STACK">Five Stack</option><option value="SCRIM">Scrim</option></select><select className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" value={form.region} onChange={(e)=>setForm({...form,region:e.target.value})}><option value="NA">NA</option><option value="EU">EU</option></select><input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" value={form.partySize} onChange={(e)=>setForm({...form,partySize:e.target.value})} /><button className="w-full rounded-xl bg-brandBlue px-4 py-3 font-bold uppercase tracking-wide text-white">Join queue</button></form>{error ? <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-red-200">{error}</div> : null}{result ? <pre className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200">{JSON.stringify(result, null, 2)}</pre> : null}</div></main>;
}
export default function QueuePage() { return <AuthGuard><QueueInner /></AuthGuard>; }
