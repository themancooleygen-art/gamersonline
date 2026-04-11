export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px",
        background: "linear-gradient(135deg, rgba(11,60,145,0.28), rgba(2,6,23,0.96) 40%, rgba(230,57,70,0.22))",
        color: "#F8FAFC",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", gap: 10, alignItems: "center", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.1)", padding: "10px 16px", borderRadius: 999, color: "#fecaca", fontWeight: 700 }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ef4444", display: "inline-block" }} />
          Active Anti-Cheat Competitive Network
        </div>

        <h1 style={{ fontSize: 64, lineHeight: 1, margin: "24px 0 16px", fontWeight: 900, textTransform: "uppercase" }}>
          Compete. Climb. <span style={{ color: "#E63946" }}>Stay Clean.</span>
        </h1>

        <p style={{ fontSize: 20, maxWidth: 760, color: "#cbd5e1", lineHeight: 1.7 }}>
          GamersOnline.gg is a competitive CS2 platform built for serious players, verified matchmaking, and aggressive anti-cheat enforcement.
        </p>

        <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
          <a href="/api/auth/steam/login" style={{ background: "#0B3C91", color: "white", padding: "14px 22px", borderRadius: 16, fontWeight: 800, textDecoration: "none", textTransform: "uppercase", letterSpacing: 1 }}>
            Sign in with Steam
          </a>
          <a href="/me" style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "white", padding: "14px 22px", borderRadius: 16, fontWeight: 800, textDecoration: "none", textTransform: "uppercase", letterSpacing: 1 }}>
            My Profile
          </a>
        </div>
      </div>
    </main>
  );
}
