import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifySessionToken } from "@/lib/session";

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
    const mapName = body.mapName;

    if (!matchId || !mapName) {
      return NextResponse.json(
        { message: "matchId and mapName are required." },
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

    const captainAId = match.captain_a?.steam_id;
    const captainBId = match.captain_b?.steam_id;

    if (
      session.steamId !== captainAId &&
      session.steamId !== captainBId
    ) {
      return NextResponse.json(
        { message: "Only captains can ban maps." },
        { status: 403 }
      );
    }

    const currentMapPool = Array.isArray(match.map_pool)
      ? match.map_pool
      : [];

    const currentBannedMaps = Array.isArray(match.banned_maps)
      ? match.banned_maps
      : [];

    if (!currentMapPool.includes(mapName)) {
      return NextResponse.json(
        { message: "That map is not in the current map pool." },
        { status: 400 }
      );
    }

    if (currentBannedMaps.includes(mapName)) {
      return NextResponse.json(
        { message: "That map has already been banned." },
        { status: 400 }
      );
    }

    if (match.picked_map && currentMapPool.length <= 1) {
      return NextResponse.json(
        { message: "Map veto is already complete." },
        { status: 400 }
      );
    }

    const updatedBannedMaps = [...currentBannedMaps, mapName];
    const remainingMaps = currentMapPool.filter((m) => m !== mapName);

    let pickedMap = match.picked_map || null;
    if (remainingMaps.length === 1) {
      pickedMap = remainingMaps[0];
    }

    const { data: updatedMatch, error: updateError } = await supabase
      .from("matches")
      .update({
        map_pool: remainingMaps,
        banned_maps: updatedBannedMaps,
        picked_map: pickedMap,
      })
      .eq("id", matchId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        {
          message: "Failed to update match veto.",
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
      match: updatedMatch,
      message: pickedMap
        ? `Map veto complete. Final map: ${pickedMap}`
        : `${mapName} banned successfully.`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Unhandled veto route error.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
