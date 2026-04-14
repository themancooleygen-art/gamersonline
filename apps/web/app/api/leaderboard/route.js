import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
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

    const { data, error } = await supabase
      .from("players")
      .select("steam_id, username, avatar, elo, wins, losses, matches_played, created_at")
      .order("elo", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json(
        {
          message: "Failed to load leaderboard.",
          error: error.message,
          details: error.details ?? null,
          hint: error.hint ?? null,
          code: error.code ?? null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      players: data || [],
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Unhandled leaderboard route error.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
