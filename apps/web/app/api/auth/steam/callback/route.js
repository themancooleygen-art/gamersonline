import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSessionToken } from "@/lib/session";

function extractSteamId(claimedId) {
  const match = claimedId.match(/\/(\d+)$/);
  return match ? match[1] : null;
}

export async function GET(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?steam=config_error`);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

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
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: verificationParams.toString(),
    cache: "no-store"
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
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`
    );

    const profileJson = await profileRes.json();
    const player = profileJson?.response?.players?.[0];

    if (player) {
      personaName = player.personaname || personaName;
      avatar = player.avatarfull || "";
    }
  } catch {}

  await supabase.from("players").upsert(
    {
      steam_id: steamId,
      username: personaName,
      avatar,
      elo: 1000,
      created_at: new Date().toISOString()
    },
    {
      onConflict: "steam_id"
    }
  );

  const token = await createSessionToken({
    steamId,
    personaName,
    avatar
  });

  const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/me`);

  response.cookies.set("gamersonline_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
