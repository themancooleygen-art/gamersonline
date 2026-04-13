"use client";

import { useEffect, useState } from "react";

export default function QueuePage() {
  const [region, setRegion] = useState("NA");
  const [queueType, setQueueType] = useState("ranked_5v5");

  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const [queueCount, setQueueCount] = useState(0);
  const [countLoading, setCountLoading] = useState(true);

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function loadQueueCount() {
    try {
      setCountLoading(true);

      const res = await fetch(
        `/api/queue/count?region=${region}&queueType=${queueType}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to load queue count."
        );
      }

      setQueueCount(data.count || 0);
    } catch {
      setQueueCount(0);
    } finally {
      setCountLoading(false);
    }
  }

  useEffect(() => {
    loadQueueCount();

    const interval = setInterval(() => {
      loadQueueCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [region, queueType]);

  async function joinQueue() {
    setLoading(true);
    setResult("");
    setError("");

    try {
      const res = await fetch("/api/queue/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region,
          queueType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error
            ? `${data.message} ${data.error}`
            : data.message || "Queue join failed."
        );
      }

      setResult(data.message || "Joined queue.");

      await loadQueueCount();
    } catch (err) {
      setError(err.message || "Queue join failed.");
    } finally {
      setLoading(false);
    }
  }

  async function leaveQueue() {
    setLeaving(true);
    setResult("");
    setError("");

    try {
      const res = await fetch("/api/queue/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region,
          queueType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error
            ? `${data.message} ${data.error}`
            : data.message || "Queue leave failed."
        );
      }

      setResult(data.message || "Left queue.");

      await loadQueueCount();
    } catch (err) {
      setError(err.message || "Queue leave failed.");
    } finally {
      setLeaving(false);
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
        <div
          style={{
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#93c5fd",
          }}
        >
          GamersOnline.gg
        </div>

        <h1
          style={{
            fontSize: 62,
            fontWeight: 900,
            margin: "14px 0 24px",
            textTransform: "uppercase",
          }}
        >
          Ranked Queue
        </h1>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 22,
            padding: "10px 16px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            style={{
              color: "#94a3b8",
              fontSize: 14,
              textTransform: "uppercase",
            }}
          >
            Live queue count
          </span>

          <span
            style={{
              fontWeight: 900,
              fontSize: 22,
              color: "#ffffff",
            }}
          >
            {countLoading ? "..." : queueCount}
          </span>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 30,
            padding: 26,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: 18,
              maxWidth: 520,
            }}
          >
            <div>
              <label>Queue Type</label>

              <select
                value={queueType}
                onChange={(e) =>
                  setQueueType(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 14,
                  background: "#0f172a",
                  color: "#fff",
                }}
              >
                <option value="ranked_5v5">
                  Ranked 5v5
                </option>
              </select>
            </div>

            <div>
              <label>Region</label>

              <select
                value={region}
                onChange={(e) =>
                  setRegion(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 14,
                  background: "#0f172a",
                  color: "#fff",
                }}
              >
                <option value="NA">NA</option>
                <option value="EU">EU</option>
                <option value="SA">SA</option>
              </select>
            </div>

            <button
              onClick={joinQueue}
              disabled={loading || leaving}
              style={{
                background: "#0B3C91",
                color: "white",
                padding: "15px",
                borderRadius: 15,
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              {loading
                ? "Joining..."
                : "Join Ranked Queue"}
            </button>

            <button
              onClick={leaveQueue}
              disabled={loading || leaving}
              style={{
                background: "#E63946",
                color: "white",
                padding: "15px",
                borderRadius: 15,
                fontWeight: 900,
                fontSize: 18,
              }}
            >
              {leaving
                ? "Leaving..."
                : "Leave Queue"}
            </button>
          </div>

          {result && (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 14,
                background:
                  "rgba(34,197,94,0.12)",
                color: "#86efac",
                fontWeight: 700,
              }}
            >
              {result}
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 14,
                background:
                  "rgba(239,68,68,0.12)",
                color: "#fecaca",
                fontWeight: 700,
              }}
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
