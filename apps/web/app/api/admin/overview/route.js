import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifySessionToken } from "@/lib/session";

export async function GET() {
  try {
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

    const adminSteamId = process.env.ADMIN_STEAM_ID;

    if (!adminSteamId || session.steamId !== adminSteamId) {
      return NextResponse.json(
        { message: "Forbidden. Admin access only." },
        { status: 403 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { message: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const [
      playersRes,
      queuedRes,
      matchesRes,
      completedRes,
      topPlayersRes,
    ] = await Promise.all([
      supabase
        .from("players")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("queue_entries")
        .select("*", { count: "exact", head: true })
        .eq("status", "queued"),

      supabase
        .from("matches")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("matches")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed"),

      supabase
        .from("players")
        .select("steam_id, username, avatar, elo, wins, losses, matches_played")
        .order("elo", { ascending: false })
        .limit(10),
    ]);

    const errors = [
      playersRes.error,
      queuedRes.error,
      matchesRes.error,
      completedRes.error,
      topPlayersRes.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          message: "Failed to load admin overview.",
          error: errors[0].message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      stats: {
        totalPlayers: playersRes.count || 0,
        queuedPlayers: queuedRes.count || 0,
        totalMatches: matchesRes.count || 0,
        completedMatches: completedRes.count || 0,
      },
      topPlayers: topPlayersRes.data || [],
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Unhandled admin overview route error.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
