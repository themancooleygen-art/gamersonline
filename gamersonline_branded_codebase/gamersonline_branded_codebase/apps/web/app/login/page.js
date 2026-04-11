"use client";
import { useState } from "react";
import { apiFetch, setToken } from "../../components/api";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function onSubmit(e) {
    e.preventDefault(); setLoading(true); setError("");
    try { const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(form) }); if (data.token) setToken(data.token); router.push("/dashboard"); }
    catch (err) { setError(err.message || "Login failed"); } finally { setLoading(false); }
  }
  return <main className="min-h-screen flex items-center justify-center px-6"><div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8"><div className="text-sm uppercase tracking-[0.22em] text-red-300">GamersOnline.gg</div><h1 className="mt-2 text-3xl font-black uppercase">Log in</h1><p className="mt-2 text-slate-300">Return to ranked play.</p><form className="mt-6 space-y-4" onSubmit={onSubmit}><input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /><input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} /><button disabled={loading} className="w-full rounded-xl bg-brandRed px-4 py-3 font-bold uppercase tracking-wide text-white">{loading ? "Logging in..." : "Log in"}</button></form>{error ? <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</div> : null}</div></main>;
}
