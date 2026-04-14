"use client";

import { useEffect, useState } from "react";

function getPlayerResult(match, steamId) {
  if (!match || !steamId) return "Unknown";

  const inTeamA = Array.isArray(match.team_a)
    ? match.team_a.some((p) => p.steam_id === steamId)
    : false;

  const inTeamB = Array.isArray(match.team_b)
    ? match.team_b.some((p) => p.steam_id === steamId)
    : false;

  if (!match.winner) return "Pending";

  if (match.winner === "A" && inTeamA) return "Win";
  if (match.winner === "B" && inTeamB) return "Win";
  if (match.winner === "A" && inTeamB) return "Loss";
  if (match.winner === "B" && inTeamA) return "Loss";

  return "Unknown";
}

export default function PlayerProfilePage({ params }) {
  const steamId = params?.steamId;

  const [player, setPlayer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/player/${steamId}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error
            ? `${data.message} ${data.error}`
            : data.message || "Failed to load player profile."
        );
      }

      setPlayer(data.player || null);
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message || "Failed to load player profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (steamId) {
      loadProfile();
    }
  }, [steamId]);

  if (loading) {
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
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>Loading player profile...</div>
      </main>
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
            fontSize: 58,
            fontWeight: 900,
            margin: "14px 0 24px",
            textTransform: "uppercase",
          }}
        >
          Player Profile
        </h1>

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

        {player ? (
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 28,
              padding: 26,
              background: "rgba(255,255,255,0.04)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.22)",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: 24,
                alignItems: "center",
              }}
            >
              <div>
                {player.avatar ? (
                  <img
                    src={player.avatar}
                    alt={player.username}
                    width="128"
                    height="128"
                    style={{
                      borderRadius: 24,
                      display: "block",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 128,
                      height: 128,
                      borderRadius: 24,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  />
                )}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    textTransform: "uppercase",
                  }}
                >
                  {player.username || "Unknown Player"}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontSize: 16,
                    color: "#cbd5e1",
                    wordBreak: "break-all",
                  }}
                >
                  Steam ID: {player.steam_id}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gap: 14,
                    marginTop: 22,
                  }}
                >
                  <StatCard label="ELO" value={player.elo ?? 1000} />
                  <StatCard label="Wins" value={player.wins ?? 0} />
                  <StatCard label="Losses" value={player.losses ?? 0} />
                  <StatCard label="Matches" value={player.matches_played ?? 0} />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 24,
            padding: 22,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#93c5fd",
              marginBottom: 14,
            }}
          >
            Match History
          </div>

          {matches.length === 0 ? (
            <div style={{ color: "#cbd5e1" }}>No match history yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {matches.map((match) => {
                const result = getPlayerResult(match, steamId);

                return (
                  <div
                    key={match.id}
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 18,
                      padding: 16,
                      background: "rgba(2,6,23,0.45)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase" }}>
                          Match
                        </div>
                        <div style={{ fontWeight: 900, marginTop: 4, wordBreak: "break-all" }}>
                          {match.id}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase" }}>
                          Map
                        </div>
                        <div style={{ fontWeight: 900, marginTop: 4 }}>
                          {match.picked_map || "TBD"}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase" }}>
                          Region
                        </div>
                        <div style={{ fontWeight: 900, marginTop: 4 }}>
                          {match.region}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase" }}>
                          Status
                        </div>
                        <div style={{ fontWeight: 900, marginTop: 4 }}>
                          {match.status}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase" }}>
                          Result
                        </div>
                        <div
                          style={{
                            fontWeight: 900,
                            marginTop: 4,
                            color:
                              result === "Win"
                                ? "#86efac"
                                : result === "Loss"
                                ? "#fecaca"
                                : "#e2e8f0",
                          }}
                        >
                          {result}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 14,
        background: "rgba(2,6,23,0.45)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#93c5fd",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 6, fontWeight: 900, fontSize: 24 }}>
        {value}
      </div>
    </div>
  );
}
