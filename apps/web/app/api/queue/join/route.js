import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verifySessionToken } from "@/lib/session";

export async function POST(request) {
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
  } catch {
    return NextResponse.json(
      { message: "Invalid session." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const queueType = body.queueType || "ranked_5v5";
  const region = body.region || "NA";

  const { data, error } = await supabase
    .from("queue_entries")
    .insert({
      steam_id: session.steamId,
      username: session.personaName,
      queue_type: queueType,
      region,
      status: "queued",
      elo: 1000
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { message: "Failed to join queue.", error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    entry: data,
    message: "Joined ranked queue."
  });
}
