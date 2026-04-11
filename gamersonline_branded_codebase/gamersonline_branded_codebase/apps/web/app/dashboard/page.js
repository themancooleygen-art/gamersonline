"use client";
import { useEffect, useState } from "react";
import AuthGuard from "../../components/auth-guard";
import { apiFetch, clearToken } from "../../components/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
function DashboardInner() {
  const router = useRouter();
  const [health, setHealth] = useState(null);
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { async function load() { try { const [healthData, meData] = await Promise.all([apiFetch("/health"), apiFetch("/auth/me")]); setHealth(healthData); setMe(meData.user); } catch (err) { setError(err.message || "Failed to load dashboard"); } } load(); }, []);
  function logout() { clearToken(); router.push("/login"); }
  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="text-sm uppercase tracking-[0.22em] text-blue-300">GamersOnline.gg</div><h1 className="mt-2 text-4xl font-black uppercase">Platform Dashboard</h1></div><div className="flex gap-3"><Link href="/queue" className="rounded-2xl border border-white/15 px-4 py-3 font-semibold">Queue</Link><Link href="/billing" className="rounded-2xl border border-white/15 px-4 py-3 font-semibold">Billing</Link><button onClick={logout} className="rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950">Logout</button></div></div>{error ? <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-red-200">{error}</div> : null}<div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-[24px] border border-white/10 bg-white/5 p-5"><div className="text-sm text-slate-400">Logged-in user</div><div className="mt-2 text-xl font-bold">{me?.gamerTag || "Loading..."}</div><div className="mt-1 text-slate-300">{me?.email || ""}</div></div><div className="rounded-[24px] border border-white/10 bg-white/5 p-5"><div className="text-sm text-slate-400">Trust score</div><div className="mt-2 text-3xl font-black text-blue-400">{me?.trustScore ?? "--"}</div></div><div className="rounded-[24px] border border-white/10 bg-white/5 p-5"><div className="text-sm text-slate-400">API health</div><div className="mt-2 text-xl font-bold">{health?.ok ? "Online" : "Loading..."}</div><div className="mt-1 text-slate-300">{health?.service || ""}</div></div></div></div></main>;
}
export default function DashboardPage() { return <AuthGuard><DashboardInner /></AuthGuard>; }
