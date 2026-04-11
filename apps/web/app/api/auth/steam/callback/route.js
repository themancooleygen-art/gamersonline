import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/session";

function extractSteamId(claimedId) {
  const match = claimedId.match(/\/(\d+)$/);
  return match ? match[1] : null;
}

export async function GET(request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const claimedId = searchParams.get("openid.claimed_id");
  if (!claimedId) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?steam=missing_claim`);
  }

  const verificationParams = new URLSearchParams();
  for (const [key, value] of searchParams.entries()) {
    verificationParams.append(key, value);
  }
  verificationParams.set("openid.mode", "check_authentication");

  const verifyRes = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: verificationParams.toString(),
    cache: "no-store",
  });

  const verifyText = await verifyRes.text();
  if (!verifyText.includes("is_valid:true")) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?steam=invalid`);
  }

  const steamId = extractSteamId(claimedId);
  if (!steamId) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?steam=bad_id`);
  }

  let personaName = "Steam Player";
  let avatar = "";

  try {
    const profileRes = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`,
      { cache: "no-store" }
    );
    const profileJson = await profileRes.json();
    const player = profileJson?.response?.players?.[0];
    if (player) {
      personaName = player.personaname || personaName;
      avatar = player.avatarfull || "";
    }
  } catch {
    // Continue even if profile fetch fails
  }

  const token = await createSessionToken({
    steamId,
    personaName,
    avatar,
  });

  const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/me`);
  response.cookies.set("gamersonline_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
