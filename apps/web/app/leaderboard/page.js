"use client";

import { useEffect, useMemo, useState } from "react";

function winRate(player) {
  const wins = player.wins || 0;
  const matches = player.matches_played || 0;
  if (!matches) return "0%";
  return `${Math.round((wins / matches) * 100)}%`;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadLeaderboard() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/leaderboard", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error
            ? `${data.message} ${data.error}`
            : data.message || "Failed to load leaderboard."
        );
      }

      setPlayers(data.players || []);
    } catch (err) {
      setError(err.message || "Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaderboard();

    const interval = setInterval(() => {
      loadLeaderboard();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredPlayers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return players;

    return players.filter((player) => {
      const username = (player.username || "").toLowerCase();
      const steamId = (player.steam_id || "").toLowerCase();
      return username.includes(q) || steamId.includes(q);
    });
  }, [players, search]);

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
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
          Leaderboard
        </h1>

        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
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
              Ranked players
            </span>

            <span
              style={{
                fontWeight: 900,
                fontSize: 22,
                color: "#ffffff",
              }}
            >
              {loading ? "..." : filteredPlayers.length}
            </span>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player or Steam ID"
            style={{
              minWidth: 300,
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "#0f172a",
              color: "#ffffff",
              outline: "none",
            }}
          />
        </div>

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

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 24,
            overflow: "hidden",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1.6fr 130px 110px 110px 140px 120px",
              gap: 12,
              padding: "16px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#93c5fd",
              fontWeight: 900,
            }}
          >
            <div>Rank</div>
            <div>Player</div>
            <div>ELO</div>
            <div>Wins</div>
            <div>Losses</div>
            <div>Matches</div>
            <div>Win Rate</div>
          </div>

          {loading ? (
            <div style={{ padding: 24, color: "#cbd5e1" }}>
              Loading leaderboard...
            </div>
          ) : null}

          {!loading && filteredPlayers.length === 0 ? (
            <div style={{ padding: 24, color: "#cbd5e1" }}>
              No matching players found.
            </div>
          ) : null}

          {!loading &&
            filteredPlayers.map((player, idx) => (
              <div
                key={player.steam_id || idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1.6fr 130px 110px 110px 140px 120px",
                  gap: 12,
                  padding: "16px 18px",
                  borderBottom:
                    idx === filteredPlayers.length - 1
                      ? "none"
                      : "1px solid rgba(255,255,255,0.06)",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 22,
                    color:
                      idx === 0
                        ? "#facc15"
                        : idx === 1
                        ? "#e2e8f0"
                        : idx === 2
                        ? "#fca5a5"
                        : "#ffffff",
                  }}
                >
                  #{idx + 1}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {player.avatar ? (
                    <img
                      src={player.avatar}
                      alt={player.username || "Player"}
                      width="44"
                      height="44"
                      style={{
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.10)",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    />
                  )}

                  <div>
                    <a
                      href={`/player/${player.steam_id}`}
                      style={{
                        fontWeight: 900,
                        fontSize: 18,
                        color: "#ffffff",
                        textDecoration: "none",
                      }}
                    >
                      {player.username || "Unknown Player"}
                    </a>

                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 12,
                        marginTop: 2,
                        wordBreak: "break-all",
                      }}
                    >
                      {player.steam_id}
                    </div>
                  </div>
                </div>

                <div style={{ fontWeight: 900, fontSize: 20 }}>
                  {player.elo ?? 1000}
                </div>

                <div style={{ fontWeight: 700 }}>
                  {player.wins ?? 0}
                </div>

                <div style={{ fontWeight: 700 }}>
                  {player.losses ?? 0}
                </div>

                <div style={{ fontWeight: 700 }}>
                  {player.matches_played ?? 0}
                </div>

                <div
                  style={{
                    fontWeight: 900,
                    color: "#86efac",
                  }}
                >
                  {winRate(player)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
