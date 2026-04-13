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

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey
    );

    const token =
      cookies().get("gamersonline_session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );
    }

    let session;

    try {
      session =
        await verifySessionToken(token);
    } catch (err) {
      return NextResponse.json(
        {
          message: "Invalid session.",
          error:
            err instanceof Error
              ? err.message
              : String(err),
        },
        { status: 401 }
      );
    }

    const body =
      await request.json().catch(() => ({}));

    const queueType =
      body.queueType || "ranked_5v5";

    const region =
      body.region || "NA";

    const { data, error } =
      await supabase
        .from("queue_entries")
        .delete()
        .eq("steam_id", session.steamId)
        .eq("queue_type", queueType)
        .eq("region", region)
        .eq("status", "queued")
        .select();

    if (error) {
      return NextResponse.json(
        {
          message:
            "Failed to leave queue.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        ok: true,
        message:
          "You were not in queue.",
      });
    }

    return NextResponse.json({
      ok: true,
      removed: data.length,
      message:
        "Left ranked queue.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        message:
          "Unhandled leave queue error.",
        error:
          err instanceof Error
            ? err.message
            : String(err),
      },
      { status: 500 }
    );
  }
}
