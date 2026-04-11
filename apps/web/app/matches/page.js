"use client";

import { useEffect, useState } from "react";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load matches.");
        setMatches(data.matches || []);
      } catch (err) {
        setError(err.message || "Failed to load matches.");
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

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
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
          GamersOnline.gg
        </div>
        <h1 style={{ fontSize: 58, fontWeight: 900, margin: "14px 0 24px", textTransform: "uppercase", letterSpacing: -1 }}>
          Recent Matches
        </h1>

        {loading ? <div style={{ color: "#cbd5e1", fontSize: 18 }}>Loading matches...</div> : null}
        {error ? <div style={{ color: "#fecaca", marginBottom: 16, fontSize: 18 }}>{error}</div> : null}

        <div style={{ display: "grid", gap: 18 }}>
          {matches.map((match) => (
            <div
              key={match.id}
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 26,
                padding: 22,
                background: "rgba(255,255,255,0.04)",
                boxShadow: "0 24px 50px rgba(0,0,0,0.20)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>Match ID</div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>{match.id}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>Queue</div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>{match.queue_type}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>Region</div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>{match.region}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>Status</div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>{match.status}</div>
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd", marginBottom: 10 }}>
                  Players
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  {(match.players || []).map((player) => (
                    <div
                      key={player.id || player.steam_id}
                      style={{
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 18,
                        padding: 14,
                        background: "rgba(2,6,23,0.50)",
                      }}
                    >
                      <div style={{ fontWeight: 900, fontSize: 18 }}>{player.username || "Unknown Player"}</div>
                      <div style={{ color: "#cbd5e1", marginTop: 6, fontSize: 14 }}>Steam ID: {player.steam_id}</div>
                      <div style={{ color: "#cbd5e1", marginTop: 4, fontSize: 14 }}>ELO: {player.elo}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {!loading && !matches.length ? (
            <div style={{ color: "#cbd5e1", fontSize: 18 }}>No matches created yet.</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
