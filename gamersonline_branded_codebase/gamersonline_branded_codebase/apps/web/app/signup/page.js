"use client";
import { useState } from "react";
import { apiFetch, setToken } from "../../components/api";
import { useRouter } from "next/navigation";
export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", gamerTag: "", region: "NA" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function onSubmit(e) {
    e.preventDefault(); setLoading(true); setError("");
    try { const data = await apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(form) }); if (data.token) setToken(data.token); router.push("/dashboard"); }
    catch (err) { setError(err.message || "Signup failed"); } finally { setLoading(false); }
  }
  return <main className="min-h-screen flex items-center justify-center px-6"><div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8"><div className="text-sm uppercase tracking-[0.22em] text-blue-300">GamersOnline.gg</div><h1 className="mt-2 text-3xl font-black uppercase">Create account</h1><p className="mt-2 text-slate-300">Enter the ranked ecosystem.</p><form className="mt-6 space-y-4" onSubmit={onSubmit}><input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /><input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} /><input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Gamer tag" value={form.gamerTag} onChange={(e)=>setForm({...form,gamerTag:e.target.value})} /><select className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" value={form.region} onChange={(e)=>setForm({...form,region:e.target.value})}><option value="NA">NA</option><option value="EU">EU</option><option value="SA">SA</option></select><button disabled={loading} className="w-full rounded-xl bg-brandBlue px-4 py-3 font-bold uppercase tracking-wide text-white">{loading ? "Creating..." : "Create account"}</button></form>{error ? <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</div> : null}</div></main>;
}
