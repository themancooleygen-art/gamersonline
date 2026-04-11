import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifySessionToken } from "@/lib/session";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const token = cookies().get("gamersonline_session")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  let session;
  try {
    session = await verifySessionToken(token);
  } catch {
    return NextResponse.json({ message: "Invalid session." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const queueType = body.queueType || "ranked_5v5";
  const region = body.region || "NA";

  const { data: existing } = await supabase
    .from("queue_entries")
    .select("id, status, queue_type, region")
    .eq("steam_id", session.steamId)
    .eq("queue_type", queueType)
    .eq("region", region)
    .eq("status", "queued")
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      ok: true,
      alreadyQueued: true,
      entry: existing,
      message: "Player is already in queue."
    });
  }

  const { data, error } = await supabase
    .from("queue_entries")
    .insert({
      steam_id: session.steamId,
      username: session.personaName,
      queue_type: queueType,
      region,
      status: "queued",
      elo: 1000
    })
    .select()
    .single();

  if (error) {
    console.error("Queue insert error:", error);
    return NextResponse.json({ message: "Failed to join queue.", error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    entry: data,
    message: "Joined ranked queue."
  });
}
