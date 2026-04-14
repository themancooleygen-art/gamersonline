"use client";

import { useEffect, useState } from "react";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [busyMapKey, setBusyMapKey] = useState("");

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

  async function banMap(matchId, mapName) {
    const key = `${matchId}:${mapName}`;
    setBusyMapKey(key);
    setActionMessage("");
    setError("");

    try {
      const res = await fetch("/api/matches/veto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId,
          mapName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error
            ? `${data.message} ${data.error}`
            : data.message || "Failed to ban map."
        );
      }

      setActionMessage(data.message || "Map veto updated.");
      await loadMatches();
    } catch (err) {
      setError(err.message || "Failed to ban map.");
    } finally {
      setBusyMapKey("");
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
            Recent matches
          </span>

          <span
            style={{
              fontWeight: 900,
              fontSize: 22,
              color: "#ffffff",
            }}
          >
            {loading ? "..." : matches.length}
          </span>
        </div>

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
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#93c5fd",
                    }}
                  >
                    Match ID
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontWeight: 900,
                      wordBreak: "break-all",
                    }}
                  >
                    {match.id}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#93c5fd",
                    }}
                  >
                    Queue
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.queue_type}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#93c5fd",
                    }}
                  >
                    Region
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.region}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#93c5fd",
                    }}
                  >
                    Status
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.status}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#93c5fd",
                    }}
                  >
                    Picked Map
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.picked_map || "TBD"}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#93c5fd",
                    }}
                  >
                    Room Code
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.room_code || "TBD"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }}
              >
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 14,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#93c5fd",
                    }}
                  >
                    Server IP
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.connect_ip || "TBD"}
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 14,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#93c5fd",
                    }}
                  >
                    Port
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.connect_port || "TBD"}
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 14,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#93c5fd",
                    }}
                  >
                    Password
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 900 }}>
                    {match.connect_password || "TBD"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 12,
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 16,
                  padding: 14,
                  background: "rgba(34,197,94,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#86efac",
                  }}
                >
                  CS2 Connect String
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontWeight: 900,
                    wordBreak: "break-all",
                    color: "#ffffff",
                  }}
                >
                  {match.connect_string || "TBD"}
                </div>
              </div>

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
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#93c5fd",
                    }}
                  >
                    Team A
                  </div>

                  <div style={{ marginTop: 8, fontWeight: 900, fontSize: 18 }}>
                    Total ELO: {match.team_a_elo || 0}
                  </div>

                  {match.captain_a ? (
                    <div
                      style={{
                        marginTop: 10,
                        marginBottom: 14,
                        padding: 10,
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#93c5fd",
                          letterSpacing: 1,
                        }}
                      >
                        Captain
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 900 }}>
                        {match.captain_a.username}
                      </div>
                    </div>
                  ) : null}

                  <div style={{ display: "grid", gap: 10 }}>
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
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#fecaca",
                    }}
                  >
                    Team B
                  </div>

                  <div style={{ marginTop: 8, fontWeight: 900, fontSize: 18 }}>
                    Total ELO: {match.team_b_elo || 0}
                  </div>

                  {match.captain_b ? (
                    <div
                      style={{
                        marginTop: 10,
                        marginBottom: 14,
                        padding: 10,
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          textTransform: "uppercase",
                          color: "#fecaca",
                          letterSpacing: 1,
                        }}
                      >
                        Captain
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 900 }}>
                        {match.captain_b.username}
                      </div>
                    </div>
                  ) : null}

                  <div style={{ display: "grid", gap: 10 }}>
                    {(match.team_b || []).map(renderPlayerCard)}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 18,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  paddingTop: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#93c5fd",
                    marginBottom: 10,
                  }}
                >
                  Captain Map Veto
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {(match.map_pool || []).map((mapName, idx) => {
                    const banned = (match.banned_maps || []).includes(mapName);
                    const picked = match.picked_map === mapName;
                    const busy = busyMapKey === `${match.id}:${mapName}`;

                    return (
                      <button
                        key={`${mapName}-${idx}`}
                        onClick={() => banMap(match.id, mapName)}
                        disabled={banned || picked || busy || !!match.picked_map}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 999,
                          fontWeight: 700,
                          cursor:
                            banned || picked || busy || !!match.picked_map
                              ? "not-allowed"
                              : "pointer",
                          border: picked
                            ? "1px solid rgba(34,197,94,0.35)"
                            : banned
                            ? "1px solid rgba(239,68,68,0.35)"
                            : "1px solid rgba(255,255,255,0.10)",
                          background: picked
                            ? "rgba(34,197,94,0.12)"
                            : banned
                            ? "rgba(239,68,68,0.12)"
                            : "rgba(255,255,255,0.04)",
                          color: picked
                            ? "#86efac"
                            : banned
                            ? "#fecaca"
                            : "#e2e8f0",
                        }}
                      >
                        {busy ? "Working..." : mapName}
                      </button>
                    );
                  })}
                </div>

                {match.picked_map ? (
                  <div
                    style={{
                      marginTop: 14,
                      fontWeight: 900,
                      color: "#86efac",
                    }}
                  >
                    Final map selected: {match.picked_map}
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 14,
                      color: "#94a3b8",
                    }}
                  >
                    Captains can ban maps until one remains.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
