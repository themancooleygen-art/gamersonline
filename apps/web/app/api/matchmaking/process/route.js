import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_MAP_POOL = [
  "Mirage",
  "Inferno",
  "Nuke",
  "Ancient",
  "Anubis",
  "Dust II",
  "Train"
];

function splitTeams(players) {
  const sorted = [...players].sort(
    (a, b) => (b.elo || 1000) - (a.elo || 1000)
  );

  const teamA = [];
  const teamB = [];
  let teamAElo = 0;
  let teamBElo = 0;

  for (const player of sorted) {
    if (teamA.length < 5 && (teamAElo <= teamBElo || teamB.length >= 5)) {
      teamA.push(player);
      teamAElo += player.elo || 1000;
    } else {
      teamB.push(player);
      teamBElo += player.elo || 1000;
    }
  }

  return {
    teamA,
    teamB,
    teamAElo,
    teamBElo,
  };
}

function pickCaptain(team) {
  if (!team || team.length === 0) return null;
  return [...team].sort((a, b) => (b.elo || 1000) - (a.elo || 1000))[0];
}

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

function pickDefaultMap(mapPool) {
  if (!mapPool || mapPool.length === 0) return null;
  return mapPool[0];
}

function buildConnectString(ip, port, password) {
  return `connect ${ip}:${port}; password ${password}`;
}

async function sendDiscordWebhook(match) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const teamAList = (match.team_a || [])
    .map((p) => `• ${p.username} (${p.elo})`)
    .join("\n");

  const teamBList = (match.team_b || [])
    .map((p) => `• ${p.username} (${p.elo})`)
    .join("\n");

  const body = {
    content: "🎮 **New GamersOnline Match Created**",
    embeds: [
      {
        title: `Match ${match.id}`,
        color: 3447003,
        fields: [
          {
            name: "Queue",
            value: `${match.queue_type} | ${match.region}`,
            inline: true,
          },
          {
            name: "Picked Map",
            value: match.picked_map || "TBD",
            inline: true,
          },
          {
            name: "Room Code",
            value: match.room_code || "TBD",
            inline: true,
          },
          {
            name: "Team A",
            value: teamAList || "No players",
            inline: false,
          },
          {
            name: "Team B",
            value: teamBList || "No players",
            inline: false,
          },
          {
            name: "Connect String",
            value: `\`${match.connect_string || "TBD"}\``,
            inline: false,
          },
        ],
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {}
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

    const body = await request.json().catch(() => ({}));
    const queueType = body.queueType || "ranked_5v5";
    const region = body.region || "NA";

    const { data: queuedPlayers, error: queueError } = await supabase
      .from("queue_entries")
      .select("*")
      .eq("status", "queued")
      .eq("queue_type", queueType)
      .eq("region", region)
      .order("created_at", { ascending: true })
      .limit(10);

    if (queueError) {
      return NextResponse.json(
        {
          message: "Failed to read queue.",
          error: queueError.message,
          details: queueError.details ?? null,
          hint: queueError.hint ?? null,
          code: queueError.code ?? null,
        },
        { status: 500 }
      );
    }

    if (!queuedPlayers || queuedPlayers.length < 10) {
      return NextResponse.json({
        ok: true,
        created: false,
        message: `Not enough players yet. ${queuedPlayers?.length || 0}/10 currently queued.`,
      });
    }

    const players = queuedPlayers.map((player) => ({
      id: player.id,
      steam_id: player.steam_id,
      username: player.username,
      elo: player.elo,
      region: player.region,
      queue_type: player.queue_type,
      queued_at: player.created_at,
    }));

    const { teamA, teamB, teamAElo, teamBElo } = splitTeams(players);

    const captainA = pickCaptain(teamA);
    const captainB = pickCaptain(teamB);

    const mapPool = [...DEFAULT_MAP_POOL];
    const bannedMaps = [];
    const pickedMap = pickDefaultMap(mapPool);
    const roomCode = generateRoomCode();

    const connectIp = "123.45.67.89";
    const connectPort = 27015;
    const connectPassword = generatePassword();
    const connectString = buildConnectString(
      connectIp,
      connectPort,
      connectPassword
    );

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .insert({
        queue_type: queueType,
        region,
        status: "created",
        player_count: players.length,
        players,
        team_a: teamA,
        team_b: teamB,
        team_a_elo: teamAElo,
        team_b_elo: teamBElo,
        captain_a: captainA,
        captain_b: captainB,
        map_pool: mapPool,
        banned_maps: bannedMaps,
        picked_map: pickedMap,
        room_code: roomCode,
        connect_ip: connectIp,
        connect_port: connectPort,
        connect_password: connectPassword,
        connect_string: connectString,
      })
      .select()
      .single();

    if (matchError) {
      return NextResponse.json(
        {
          message: "Failed to create match.",
          error: matchError.message,
          details: matchError.details ?? null,
          hint: matchError.hint ?? null,
          code: matchError.code ?? null,
        },
        { status: 500 }
      );
    }

    const ids = queuedPlayers.map((player) => player.id);

    const { error: updateError } = await supabase
      .from("queue_entries")
      .update({ status: "matched" })
      .in("id", ids);

    if (updateError) {
      return NextResponse.json(
        {
          ok: false,
          message: "Match created, but queue entry update failed.",
          match,
          error: updateError.message,
          details: updateError.details ?? null,
          hint: updateError.hint ?? null,
          code: updateError.code ?? null,
        },
        { status: 500 }
      );
    }

    await sendDiscordWebhook(match);

    return NextResponse.json({
      ok: true,
      created: true,
      match,
      message: "Match created successfully from 10 queued players.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Unhandled matchmaking process error.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
