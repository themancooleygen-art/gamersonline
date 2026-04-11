import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/session";

export default async function MePage() {
  const token = cookies().get("gamersonline_session")?.value;

  if (!token) {
    redirect("/");
  }

  let session;
  try {
    session = await verifySessionToken(token);
  } catch {
    redirect("/");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "#F8FAFC", padding: "48px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
          GamersOnline.gg
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 900, margin: "12px 0 20px" }}>Steam Connected</h1>

        <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 24, background: "rgba(255,255,255,0.04)" }}>
          {session.avatar ? (
            <img
              src={session.avatar}
              alt={session.personaName}
              width="96"
              height="96"
              style={{ borderRadius: 16, display: "block", marginBottom: 16 }}
            />
          ) : null}

          <div style={{ fontSize: 28, fontWeight: 800 }}>{session.personaName}</div>
          <div style={{ marginTop: 10, color: "#cbd5e1" }}>Steam ID: {session.steamId}</div>

          <div style={{ marginTop: 24 }}>
            <a
              href="/api/auth/steam/logout"
              style={{
                display: "inline-block",
                background: "#E63946",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 14,
                fontWeight: 800,
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
