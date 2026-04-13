import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
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

    const url = new URL(request.url);
    const region = url.searchParams.get("region") || "NA";
    const queueType = url.searchParams.get("queueType") || "ranked_5v5";

    const { count, error } = await supabase
      .from("queue_entries")
      .select("*", { count: "exact", head: true })
      .eq("region", region)
      .eq("queue_type", queueType)
      .eq("status", "queued");

    if (error) {
      return NextResponse.json(
        {
          message: "Failed to load queue count.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      count: count || 0,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Unhandled queue count error.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
