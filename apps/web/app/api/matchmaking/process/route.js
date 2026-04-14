import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function splitTeams(players) {
  const sorted = [...players].sort((a, b) => (b.elo || 1000) - (a.elo || 1000));

  const teamA = [];
  const teamB = [];
  let teamAElo = 0;
  let teamBElo = 0;

  for (const player of sorted) {
    if (teamA.length < 5 && (teamAElo <= teamBElo || teamB.length >= 5)) {
      teamA.push(player);
      teamAElo += player.elo || 1000;
    } else {
      teamB.push(player);
      teamBElo += player.elo || 1000;
    }
  }

  return {
    teamA,
    teamB,
    teamAElo,
    teamBElo,
  };
}

export async function POST(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { message: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await request.json().catch(() => ({}));
    const queueType = body.queueType || "ranked_5v5";
    const region = body.region || "NA";

    const { data: queuedPlayers, error: queueError } = await supabase
      .from("queue_entries")
      .select("*")
      .eq("status", "queued")
      .eq("queue_type", queueType)
      .eq("region", region)
      .order("created_at", { ascending: true })
      .limit(10);

    if (queueError) {
      return NextResponse.json(
        {
          message: "Failed to read queue.",
          error: queueError.message,
          details: queueError.details ?? null,
          hint: queueError.hint ?? null,
          code: queueError.code ?? null,
        },
        { status: 500 }
      );
    }

    if (!queuedPlayers || queuedPlayers.length < 10) {
      return NextResponse.json({
        ok: true,
        created: false,
        message: `Not enough players yet. ${queuedPlayers?.length || 0}/10 currently queued.`,
      });
    }

    const players = queuedPlayers.map((player) => ({
      id: player.id,
      steam_id: player.steam_id,
      username: player.username,
      elo: player.elo,
      region: player.region,
      queue_type: player.queue_type,
      queued_at: player.created_at,
    }));

    const { teamA, teamB, teamAElo, teamBElo } = splitTeams(players);

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .insert({
        queue_type: queueType,
        region,
        status: "created",
        player_count: players.length,
        players,
        team_a: teamA,
        team_b: teamB,
        team_a_elo: teamAElo,
        team_b_elo: teamBElo,
      })
      .select()
      .single();

    if (matchError) {
      return NextResponse.json(
        {
          message: "Failed to create match.",
          error: matchError.message,
          details: matchError.details ?? null,
          hint: matchError.hint ?? null,
          code: matchError.code ?? null,
        },
        { status: 500 }
      );
    }

    const ids = queuedPlayers.map((player) => player.id);

    const { error: updateError } = await supabase
      .from("queue_entries")
      .update({ status: "matched" })
      .in("id", ids);

    if (updateError) {
      return NextResponse.json(
        {
          ok: false,
          message: "Match created, but queue entry update failed.",
          match,
          error: updateError.message,
          details: updateError.details ?? null,
          hint: updateError.hint ?? null,
          code: updateError.code ?? null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      created: true,
      match,
      message: "Match created successfully from 10 queued players.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Unhandled matchmaking process error.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
