import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const queueType = body.queueType || "ranked_5v5";
  const region = body.region || "NA";

  const { data: queuedPlayers } = await supabase
    .from("queue_entries")
    .select("*")
    .eq("status", "queued")
    .eq("queue_type", queueType)
    .eq("region", region)
    .limit(10);

  if (!queuedPlayers || queuedPlayers.length < 10) {
    return NextResponse.json({
      message: `Not enough players yet (${queuedPlayers?.length || 0}/10)`
    });
  }

  const players = queuedPlayers.map(p => ({
    id: p.id,
    steam_id: p.steam_id,
    username: p.username,
    elo: p.elo
  }));

  const { data: match } = await supabase
    .from("matches")
    .insert({
      queue_type: queueType,
      region,
      players,
      player_count: 10
    })
    .select()
    .single();

  await supabase
    .from("queue_entries")
    .update({ status: "matched" })
    .in("id", queuedPlayers.map(p => p.id));

  return NextResponse.json({
    message: "Match created successfully",
    match
  });
}
