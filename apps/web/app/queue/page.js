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
  throw new Error(
    data.error
      ? `${data.message} ${data.error}`
      : (data.message || "Queue join failed.")
  );
}

      setResult(data.message || "Joined queue.");
    } catch (err) {
      setError(err.message || "Queue join failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(11,60,145,0.28), rgba(2,6,23,0.98) 42%, rgba(230,57,70,0.18))",
        color: "#F8FAFC",
        padding: "48px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
          GamersOnline.gg
        </div>
        <h1 style={{ fontSize: 62, fontWeight: 900, margin: "14px 0 24px", textTransform: "uppercase", letterSpacing: -1 }}>
          Ranked Queue
        </h1>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 30,
            padding: 26,
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 28px 60px rgba(0,0,0,0.22)",
          }}
        >
          <div style={{ display: "grid", gap: 18, maxWidth: 520 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#e2e8f0", fontSize: 16 }}>Queue Type</label>
              <select
                value={queueType}
                onChange={(e) => setQueueType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "#0f172a",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.10)",
                  fontSize: 16
                }}
              >
                <option value="ranked_5v5">Ranked 5v5</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#e2e8f0", fontSize: 16 }}>Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "#0f172a",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.10)",
                  fontSize: 16
                }}
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
                padding: "15px 18px",
                borderRadius: 15,
                border: "none",
                fontWeight: 900,
                fontSize: 18,
                textTransform: "uppercase",
                letterSpacing: 1,
                cursor: "pointer",
                boxShadow: "0 18px 40px rgba(11,60,145,0.26)"
              }}
            >
              {loading ? "Joining..." : "Join Ranked Queue"}
            </button>
          </div>

          {result ? (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 14,
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.2)",
                color: "#86efac",
                fontWeight: 700
              }}
            >
              {result}
            </div>
          ) : null}

          {error ? (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 14,
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#fecaca",
                fontWeight: 700
              }}
            >
              {error}
            </div>
          ) : null}

          <div style={{ marginTop: 24, color: "#94a3b8", fontSize: 18 }}>
            You must be signed in with Steam to join queue.
          </div>
        </div>
      </div>
    </main>
  );
}
