
export const metadata = {
  title: "GamersOnline.gg",
  description: "Competitive CS2 matchmaking platform"
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
