import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifySessionToken } from "@/lib/session";

export async function POST(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const secret = process.env.NEXTAUTH_SECRET;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          message: "Missing Supabase environment variables.",
          debug: {
            hasSupabaseUrl: !!supabaseUrl,
            hasServiceRoleKey: !!serviceRoleKey,
          },
        },
        { status: 500 }
      );
    }

    if (!secret) {
      return NextResponse.json(
        {
          message: "Missing NEXTAUTH_SECRET.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const token = cookies().get("gamersonline_session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated. Missing gamersonline_session cookie." },
        { status: 401 }
      );
    }

    let session;
    try {
      session = await verifySessionToken(token);
    } catch (err) {
      return NextResponse.json(
        {
          message: "Session verification failed.",
          error: err instanceof Error ? err.message : String(err),
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const queueType = body.queueType || "ranked_5v5";
    const region = body.region || "NA";

    const { data: existingEntries, error: existingError } = await supabase
      .from("queue_entries")
      .select("id, steam_id, queue_type, region, status, created_at")
      .eq("steam_id", session.steamId)
      .eq("queue_type", queueType)
      .eq("region", region)
      .eq("status", "queued")
      .order("created_at", { ascending: true });

    if (existingError) {
      return NextResponse.json(
        {
          message: "Failed to check existing queue entry.",
          error: existingError.message,
          details: existingError.details ?? null,
          hint: existingError.hint ?? null,
          code: existingError.code ?? null,
        },
        { status: 500 }
      );
    }

    if (existingEntries && existingEntries.length > 0) {
      return NextResponse.json({
        ok: true,
        alreadyQueued: true,
        entry: existingEntries[0],
        duplicateCount: existingEntries.length,
        message: "You are already in queue.",
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
        elo: 1000,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          message: "Failed to join queue.",
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
      entry: data,
      message: "Joined ranked queue.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Unhandled queue route error.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
