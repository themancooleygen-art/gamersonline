export default function HomePage() {
  const stats = [
    ["Verified Players", "128,420"],
    ["Daily Matches", "9,340"],
    ["Flags Reviewed", "31,882"],
  ];

  const features = [
    "Verified competitive queues",
    "Aggressive anti-cheat enforcement",
    "Ranked ladders and tournaments",
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px",
        background:
          "linear-gradient(135deg, rgba(11,60,145,0.30), rgba(2,6,23,0.98) 40%, rgba(230,57,70,0.22))",
        color: "#F8FAFC",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "inline-flex",
            gap: 10,
            alignItems: "center",
            border: "1px solid rgba(239,68,68,0.22)",
            background: "rgba(239,68,68,0.10)",
            padding: "10px 16px",
            borderRadius: 999,
            color: "#fecaca",
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#ef4444",
              display: "inline-block",
            }}
          />
          Active Anti-Cheat Competitive Network
        </div>

        <h1
          style={{
            fontSize: 72,
            lineHeight: 0.95,
            margin: "26px 0 18px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          Compete. Climb. <span style={{ color: "#E63946" }}>Stay Clean.</span>
        </h1>

        <p
          style={{
            fontSize: 22,
            maxWidth: 820,
            color: "#cbd5e1",
            lineHeight: 1.7,
            marginBottom: 26,
          }}
        >
          GamersOnline.gg is the next-generation CS2 competitive platform built
          for serious players, verified matchmaking, and aggressive anti-cheat
          enforcement.
        </p>

        <div style={{ display: "flex", gap: 16, marginTop: 22, flexWrap: "wrap" }}>
          <a
            href="/api/auth/steam/login"
            style={{
              background: "#0B3C91",
              color: "white",
              padding: "15px 24px",
              borderRadius: 16,
              fontWeight: 900,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: 1,
              boxShadow: "0 18px 40px rgba(11,60,145,0.28)",
            }}
          >
            Sign in with Steam
          </a>

          <a
            href="/queue"
            style={{
              background: "rgba(230,57,70,0.14)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "white",
              padding: "15px 24px",
              borderRadius: 16,
              fontWeight: 900,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Join Queue
          </a>

          <a
            href="/matches"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              padding: "15px 24px",
              borderRadius: 16,
              fontWeight: 900,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            View Matches
          </a>

          <a
            href="/leaderboard"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              padding: "15px 24px",
              borderRadius: 16,
              fontWeight: 900,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Leaderboard
          </a>

          <a
            href="/me"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              padding: "15px 24px",
              borderRadius: 16,
              fontWeight: 900,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            My Profile
          </a>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
          {features.map((feature) => (
            <div
              key={feature}
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 999,
                padding: "10px 16px",
                color: "#e2e8f0",
                fontSize: 14,
              }}
            >
              {feature}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 18,
            marginTop: 42,
            maxWidth: 860,
          }}
        >
          {stats.map(([label, value]) => (
            <div
              key={label}
              style={{
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(2,6,23,0.72)",
                borderRadius: 24,
                padding: 22,
                boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 900 }}>{value}</div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#94a3b8",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 48,
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 30,
            background: "rgba(2,6,23,0.80)",
            padding: 26,
            maxWidth: 720,
            boxShadow: "0 28px 60px rgba(0,0,0,0.28)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#94a3b8",
                }}
              >
                Live Queue Status
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 34,
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                NA Premier 5v5
              </div>
            </div>

            <div
              style={{
                border: "1px solid rgba(34,197,94,0.2)",
                background: "rgba(34,197,94,0.10)",
                color: "#86efac",
                borderRadius: 999,
                padding: "10px 16px",
                fontWeight: 900,
              }}
            >
              Queue Open
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
