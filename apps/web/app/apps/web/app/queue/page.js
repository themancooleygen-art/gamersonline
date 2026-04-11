"use client";

import { useState } from "react";

export default function QueuePage() {
  const [region, setRegion] = useState("NA");
  const [queueType, setQueueType] = useState("ranked_5v5");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function joinQueue() {
    setLoading(true);
    setResult("");
    setError("");

    try {
      const res = await fetch("/api/queue/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ region, queueType })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Queue join failed.");
      }

      setResult(data.message || "Joined queue.");
    } catch (err) {
      setError(err.message || "Queue join failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "#F8FAFC", padding: "48px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
          GamersOnline.gg
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 900, margin: "12px 0 20px" }}>Ranked Queue</h1>

        <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 24, background: "rgba(255,255,255,0.04)" }}>
          <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#cbd5e1" }}>Queue Type</label>
              <select
                value={queueType}
                onChange={(e) => setQueueType(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <option value="ranked_5v5">Ranked 5v5</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#cbd5e1" }}>Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <option value="NA">NA</option>
                <option value="EU">EU</option>
                <option value="SA">SA</option>
              </select>
            </div>

            <button
              onClick={joinQueue}
              disabled={loading}
              style={{
                background: "#0B3C91",
                color: "white",
                padding: "14px 18px",
                borderRadius: 14,
                border: "none",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
                cursor: "pointer"
              }}
            >
              {loading ? "Joining..." : "Join Ranked Queue"}
            </button>
          </div>

          {result ? (
            <div style={{ marginTop: 18, padding: 14, borderRadius: 14, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }}>
              {result}
            </div>
          ) : null}

          {error ? (
            <div style={{ marginTop: 18, padding: 14, borderRadius: 14, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)", color: "#fecaca" }}>
              {error}
            </div>
          ) : null}

          <div style={{ marginTop: 24, color: "#94a3b8" }}>
            You must be signed in with Steam to join queue.
          </div>
        </div>
      </div>
    </main>
  );
}
