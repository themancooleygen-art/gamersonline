import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifySessionToken } from "@/lib/session";

function calculateEloChange(teamAElo, teamBElo, winner) {
  const avgA = teamAElo / 5;
  const avgB = teamBElo / 5;

  const expectedA = 1 / (1 + Math.pow(10, (avgB - avgA) / 400));
  const expectedB = 1 / (1 + Math.pow(10, (avgA - avgB) / 400));

  const scoreA = winner === "A" ? 1 : 0;
  const scoreB = winner === "B" ? 1 : 0;

  const k = 32;

  const changeA = Math.round(k * (scoreA - expectedA));
  const changeB = Math.round(k * (scoreB - expectedB));

  return {
    changeA,
    changeB,
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

    const token = cookies().get("gamersonline_session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );
    }

    let session;
    try {
      session = await verifySessionToken(token);
    } catch (err) {
      return NextResponse.json(
        {
          message: "Invalid session.",
          error: err instanceof Error ? err.message : String(err),
        },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const matchId = body.matchId;
    const winner = body.winner;

    if (!matchId || !winner || !["A", "B"].includes(winner)) {
      return NextResponse.json(
        { message: "matchId and winner (A or B) are required." },
        { status: 400 }
      );
    }

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .eq("id", matchId)
      .single();

    if (matchError || !match) {
      return NextResponse.json(
        {
          message: "Match not found.",
          error: matchError?.message || null,
        },
        { status: 404 }
      );
    }

    if (match.status === "completed") {
      return NextResponse.json(
        { message: "Match has already been reported." },
        { status: 400 }
      );
    }

    const captainAId = match.captain_a?.steam_id;
    const captainBId = match.captain_b?.steam_id;

    if (
      session.steamId !== captainAId &&
      session.steamId !== captainBId
    ) {
      return NextResponse.json(
        { message: "Only captains can report results." },
        { status: 403 }
      );
    }

    const teamA = Array.isArray(match.team_a) ? match.team_a : [];
    const teamB = Array.isArray(match.team_b) ? match.team_b : [];
    const teamAElo = match.team_a_elo || 5000;
    const teamBElo = match.team_b_elo || 5000;

    const { changeA, changeB } = calculateEloChange(teamAElo, teamBElo, winner);

    const winnerTeam = winner === "A" ? teamA : teamB;
    const loserTeam = winner === "A" ? teamB : teamA;

    for (const player of winnerTeam) {
      const currentElo = player.elo || 1000;

      const { data: existingPlayer } = await supabase
        .from("players")
        .select("elo, wins, losses, matches_played")
        .eq("steam_id", player.steam_id)
        .single();

      const nextElo = (existingPlayer?.elo ?? currentElo) + (winner === "A" ? changeA : changeB);

      await supabase
        .from("players")
        .update({
          elo: nextElo,
          wins: (existingPlayer?.wins ?? 0) + 1,
          matches_played: (existingPlayer?.matches_played ?? 0) + 1,
        })
        .eq("steam_id", player.steam_id);
    }

    for (const player of loserTeam) {
      const currentElo = player.elo || 1000;

      const { data: existingPlayer } = await supabase
        .from("players")
        .select("elo, wins, losses, matches_played")
        .eq("steam_id", player.steam_id)
        .single();

      const nextElo = (existingPlayer?.elo ?? currentElo) + (winner === "A" ? changeB : changeA);

      await supabase
        .from("players")
        .update({
          elo: nextElo,
          losses: (existingPlayer?.losses ?? 0) + 1,
          matches_played: (existingPlayer?.matches_played ?? 0) + 1,
        })
        .eq("steam_id", player.steam_id);
    }

    const { data: updatedMatch, error: updateMatchError } = await supabase
      .from("matches")
      .update({
        status: "completed",
        winner,
        completed_at: new Date().toISOString(),
        result_reported_by: session.steamId,
      })
      .eq("id", matchId)
      .select()
      .single();

    if (updateMatchError) {
      return NextResponse.json(
        {
          message: "Failed to finalize match result.",
          error: updateMatchError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      match: updatedMatch,
      eloChange: {
        teamA: changeA,
        teamB: changeB,
      },
      message: `Team ${winner} reported as winner. ELO updated successfully.`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Unhandled report result error.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
