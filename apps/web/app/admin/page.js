"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAdminData() {
    try {
      setLoading(true);
      setError("");

      const [overviewRes, matchesRes] = await Promise.all([
        fetch("/api/admin/overview", {
          method: "GET",
          cache: "no-store",
        }),
        fetch("/api/admin/recent-matches", {
          method: "GET",
          cache: "no-store",
        }),
      ]);

      const overviewData = await overviewRes.json();
      const matchesData = await matchesRes.json();

      if (!overviewRes.ok) {
        throw new Error(
          overviewData.error
            ? `${overviewData.message} ${overviewData.error}`
            : overviewData.message || "Failed to load admin overview."
        );
      }

      if (!matchesRes.ok) {
        throw new Error(
          matchesData.error
            ? `${matchesData.message} ${matchesData.error}`
            : matchesData.message || "Failed to load recent matches."
        );
      }

      setStats(overviewData.stats || null);
      setTopPlayers(overviewData.topPlayers || []);
      setRecentMatches(matchesData.matches || []);
    } catch (err) {
      setError(err.message || "Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();

    const interval = setInterval(() => {
      loadAdminData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  function StatCard({ label, value }) {
    return (
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 22,
          padding: 20,
          background: "rgba(255,255,255,0.04)",
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
          {label}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 34,
            fontWeight: 900,
          }}
        >
          {value}
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
          Admin Dashboard
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

        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            marginBottom: 24,
          }}
        >
          <StatCard
            label="Total Players"
            value={loading ? "..." : stats?.totalPlayers ?? 0}
          />
          <StatCard
            label="Queued Players"
            value={loading ? "..." : stats?.queuedPlayers ?? 0}
          />
          <StatCard
            label="Total Matches"
            value={loading ? "..." : stats?.totalMatches ?? 0}
          />
          <StatCard
            label="Completed Matches"
            value={loading ? "..." : stats?.completedMatches ?? 0}
          />
        </div>

        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "1fr 1fr",
          }}
        >
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
                marginBottom: 16,
              }}
            >
              Top 10 Players
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {topPlayers.map((player, idx) => (
                <div
                  key={player.steam_id || idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "70px 1fr 90px",
                    gap: 12,
                    alignItems: "center",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 12,
                    background: "rgba(2,6,23,0.45)",
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

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {player.avatar ? (
                      <img
                        src={player.avatar}
                        alt={player.username || "Player"}
                        width="38"
                        height="38"
                        style={{
                          borderRadius: 10,
                          objectFit: "cover",
                          border: "1px solid rgba(255,255,255,0.10)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.08)",
                        }}
                      />
                    )}

                    <div>
                      <div style={{ fontWeight: 900 }}>
                        {player.username || "Unknown Player"}
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: 12 }}>
                        {player.wins ?? 0}W / {player.losses ?? 0}L
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      fontWeight: 900,
                      fontSize: 20,
                    }}
                  >
                    {player.elo ?? 1000}
                  </div>
                </div>
              ))}

              {!loading && topPlayers.length === 0 ? (
                <div style={{ color: "#cbd5e1" }}>No player data yet.</div>
              ) : null}
            </div>
          </div>

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
                marginBottom: 16,
              }}
            >
              Recent Matches
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {recentMatches.map((match) => (
                <div
                  key={match.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: 14,
                    background: "rgba(2,6,23,0.45)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase" }}>
                        Match
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 900, wordBreak: "break-all" }}>
                        {match.id}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase" }}>
                        Status
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 900 }}>
                        {match.status}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase" }}>
                        Winner
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 900 }}>
                        {match.winner ? `Team ${match.winner}` : "Pending"}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase" }}>
                        Map
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 900 }}>
                        {match.picked_map || "TBD"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && recentMatches.length === 0 ? (
                <div style={{ color: "#cbd5e1" }}>No matches yet.</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
