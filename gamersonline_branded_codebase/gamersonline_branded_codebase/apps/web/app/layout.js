import "./globals.css";
export const metadata = {
  title: "GamersOnline.gg",
  description: "Competitive CS2 matchmaking platform with active anti-cheat, ranked ladders, and tournaments."
};
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
