"use client";

import { useEffect, useState } from "react";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [busyKey, setBusyKey] = useState("");

  async function loadMatches() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/matches", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error
            ? `${data.message} ${data.error}`
            : data.message || "Failed to load matches."
        );
      }

      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message || "Failed to load matches.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMatches();

    const interval = setInterval(() => {
      loadMatches();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function reportWinner(matchId, winner) {
    const key = `${matchId}:${winner}`;
    setBusyKey(key);
    setActionMessage("");
    setError("");

    try {
      const res = await fetch("/api/matches/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId,
          winner,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error
            ? `${data.message} ${data.error}`
            : data.message || "Failed to report result."
        );
      }

      setActionMessage(data.message || "Result reported.");
      await loadMatches();
    } catch (err) {
      setError(err.message || "Failed to report result.");
    } finally {
      setBusyKey("");
    }
  }

  function renderPlayerCard(player, idx) {
    return (
      <div
        key={player.id || player.steam_id || idx}
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: 12,
          background: "rgba(2,6,23,0.45)",
        }}
      >
        <div style={{ fontWeight: 900 }}>
          {player.username || "Unknown Player"}
        </div>
        <div style={{ color: "#cbd5e1", marginTop: 4, fontSize: 14 }}>
          Steam ID: {player.steam_id}
        </div>
        <div style={{ color: "#cbd5e1", marginTop: 4, fontSize: 14 }}>
          ELO: {player.elo}
        </div>
      </div>
    );
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
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
          Matches
        </h1>

        {actionMessage ? (
          <div
            style={{
              marginBottom: 18,
              padding: 14,
              borderRadius: 14,
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#86efac",
              fontWeight: 700,
            }}
          >
            {actionMessage}
          </div>
        ) : null}

        {error ? (
          <div
            style={{
              marginBottom: 18,
              padding: 14,
              borderRadius: 14,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#fecaca",
              fontWeight: 700,
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </div>
        ) : null}

        {!loading && matches.length === 0 ? (
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 24,
              padding: 24,
              background: "rgba(255,255,255,0.04)",
              color: "#cbd5e1",
              fontSize: 18,
            }}
          >
            No matches created yet.
          </div>
        ) : null}

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
              <div
                style={{
                  display: "grid",
                  gap: 16,
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
                    Match ID
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900, wordBreak: "break-all" }}>
                    {match.id}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
                    Status
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.status}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
                    Winner
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.winner ? `Team ${match.winner}` : "Pending"}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
                    Picked Map
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.picked_map || "TBD"}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
                    Room Code
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.room_code || "TBD"}
                  </div>
                </div>
              </div>

              {match.status !== "completed" ? (
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => reportWinner(match.id, "A")}
                    disabled={busyKey === `${match.id}:A` || busyKey === `${match.id}:B`}
                    style={{
                      background: "#0B3C91",
                      color: "white",
                      padding: "12px 18px",
                      borderRadius: 14,
                      border: "none",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {busyKey === `${match.id}:A` ? "Reporting..." : "Report Team A Win"}
                  </button>

                  <button
                    onClick={() => reportWinner(match.id, "B")}
                    disabled={busyKey === `${match.id}:A` || busyKey === `${match.id}:B`}
                    style={{
                      background: "#E63946",
                      color: "white",
                      padding: "12px 18px",
                      borderRadius: 14,
                      border: "none",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {busyKey === `${match.id}:B` ? "Reporting..." : "Report Team B Win"}
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 20,
                    padding: 14,
                    borderRadius: 14,
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    color: "#86efac",
                    fontWeight: 700,
                  }}
                >
                  Match complete. Winner: Team {match.winner}
                </div>
              )}

              <div
                style={{
                  marginTop: 20,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    border: "1px solid rgba(11,60,145,0.35)",
                    borderRadius: 20,
                    padding: 18,
                    background: "rgba(11,60,145,0.12)",
                  }}
                >
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
                    Team A
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 900, fontSize: 18 }}>
                    Total ELO: {match.team_a_elo || 0}
                  </div>
                  <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                    {(match.team_a || []).map(renderPlayerCard)}
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid rgba(230,57,70,0.35)",
                    borderRadius: 20,
                    padding: 18,
                    background: "rgba(230,57,70,0.12)",
                  }}
                >
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#fecaca" }}>
                    Team B
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 900, fontSize: 18 }}>
                    Total ELO: {match.team_b_elo || 0}
                  </div>
                  <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                    {(match.team_b || []).map(renderPlayerCard)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
