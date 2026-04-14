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
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(11,60,145,0.28), rgba(2,6,23,0.98) 42%, rgba(230,57,70,0.20))",
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
            fontSize: 58,
            fontWeight: 900,
            margin: "14px 0 24px",
            textTransform: "uppercase",
            letterSpacing: -1,
          }}
        >
          Steam Connected
        </h1>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 28,
            padding: 26,
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.22)",
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
              {session.avatar ? (
                <img
                  src={session.avatar}
                  alt={session.personaName}
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
                {session.personaName}
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  color: "#cbd5e1",
                  wordBreak: "break-all",
                }}
              >
                Steam ID: {session.steamId}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  marginTop: 28,
                }}
              >
                <a
                  href="/queue"
                  style={{
                    display: "inline-block",
                    background: "#0B3C91",
                    color: "#fff",
                    padding: "13px 18px",
                    borderRadius: 14,
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
                    display: "inline-block",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "#fff",
                    padding: "13px 18px",
                    borderRadius: 14,
                    fontWeight: 900,
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  View Matches
                </a>

                <a
                  href="/api/auth/steam/logout"
                  style={{
                    display: "inline-block",
                    background: "#E63946",
                    color: "#fff",
                    padding: "13px 18px",
                    borderRadius: 14,
                    fontWeight: 900,
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
        </div>
      </div>
    </main>
  );
}
