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
      .from("matches")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json(
        {
          message: "Failed to load recent matches.",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      matches: data || [],
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Unhandled admin recent matches route error.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
