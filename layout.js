export const metadata = {
  title: "GamersOnline.gg",
  description: "Competitive CS2 matchmaking platform with ranked queues and active anti-cheat.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#020617", color: "#F8FAFC", fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
