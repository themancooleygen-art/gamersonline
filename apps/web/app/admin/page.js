import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/session";
import AdminClientPage from "./AdminClientPage";

export default async function AdminPage() {
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

  const adminSteamId = process.env.ADMIN_STEAM_ID;

  if (!adminSteamId || session.steamId !== adminSteamId) {
    redirect("/");
  }

  return <AdminClientPage />;
}
