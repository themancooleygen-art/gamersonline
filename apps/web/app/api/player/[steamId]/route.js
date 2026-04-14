import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request, { params }) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { message: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    const steamId = params?.steamId;

    if (!steamId) {
      return NextResponse.json(
        { message: "steamId is required." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("steam_id", steamId)
      .single();

    if (playerError || !player) {
      return NextResponse.json(
        {
          message: "Player not found.",
          error: playerError?.message || null,
        },
        { status: 404 }
      );
    }

    const { data: matches, error: matchesError } = await supabase
      .from("matches")
      .select("*")
      .or(
        `players.cs.["{\\"steam_id\\":\\"${steamId}\\"}"],team_a.cs.["{\\"steam_id\\":\\"${steamId}\\"}"],team_b.cs.["{\\"steam_id\\":\\"${steamId}\\"}"]`
      )
      .order("created_at", { ascending: false })
      .limit(25);

    if (matchesError) {
      return NextResponse.json(
        {
          message: "Failed to load player match history.",
          error: matchesError.message,
          details: matchesError.details ?? null,
          hint: matchesError.hint ?? null,
          code: matchesError.code ?? null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      player,
      matches: matches || [],
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Unhandled player profile route error.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
