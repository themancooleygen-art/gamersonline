
export const metadata = {
  title: "GamersOnline.gg",
  description: "Competitive CS2 matchmaking platform with ranked queues and active anti-cheat."
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{ margin: 0, background: "#020617", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
