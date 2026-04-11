"use client";
import { useEffect, useState } from "react";
import AuthGuard from "../../components/auth-guard";
import { apiFetch } from "../../components/api";
function BillingInner() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  useEffect(() => { apiFetch("/auth/me").then((data) => setMe(data.user)).catch((err) => setError(err.message || "Failed to load user")); }, []);
  async function startCheckout(plan) { try { setLoading(plan); setError(""); const data = await apiFetch("/billing/checkout-session", { method: "POST", body: JSON.stringify({ userId: me.id, plan }) }); if (data.url) window.location.href = data.url; } catch (err) { setError(err.message || "Checkout failed"); } finally { setLoading(""); } }
  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-5xl"><div className="text-sm uppercase tracking-[0.22em] text-blue-300">GamersOnline.gg</div><h1 className="mt-2 text-4xl font-black uppercase">Billing</h1><p className="mt-2 text-slate-300">Choose the plan that fits your grind.</p>{error ? <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-red-200">{error}</div> : null}<div className="mt-8 grid gap-4 md:grid-cols-2">{[{ plan: "PRO", price: "$12/mo", text: "Advanced player features and premium stats." },{ plan: "ORGANIZER", price: "$79/mo", text: "Tournament and organizer tools." }].map((item) => <div key={item.plan} className="rounded-[28px] border border-white/10 bg-white/5 p-6"><div className="text-sm uppercase tracking-[0.22em] text-red-300">{item.plan}</div><div className="mt-3 text-4xl font-black">{item.price}</div><p className="mt-3 text-slate-300">{item.text}</p><button onClick={() => startCheckout(item.plan)} disabled={!me || loading === item.plan} className="mt-6 rounded-xl bg-brandRed px-4 py-3 font-bold uppercase tracking-wide text-white">{loading === item.plan ? "Starting..." : `Choose ${item.plan}`}</button></div>)}</div></div></main>;
}
export default function BillingPage() { return <AuthGuard><BillingInner /></AuthGuard>; }
