"use client";
import { useEffect, useState } from "react";
import { getToken } from "./api";
import { useRouter } from "next/navigation";
export default function AuthGuard({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => { const token = getToken(); if (!token) { router.push("/login"); return; } setReady(true); }, [router]);
  if (!ready) return <div className="min-h-screen flex items-center justify-center text-slate-300">Checking session...</div>;
  return children;
}
