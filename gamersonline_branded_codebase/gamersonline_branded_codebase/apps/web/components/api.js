"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export function getApiUrl(path) { return `${API_URL}${path}`; }
export function getToken() { if (typeof window === "undefined") return ""; return localStorage.getItem("gamersonline_token") || ""; }
export function setToken(token) { if (typeof window !== "undefined") localStorage.setItem("gamersonline_token", token); }
export function clearToken() { if (typeof window !== "undefined") localStorage.removeItem("gamersonline_token"); }
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(getApiUrl(path), { ...options, headers });
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof data === "string" ? data : data.message || "Request failed");
  return data;
}
