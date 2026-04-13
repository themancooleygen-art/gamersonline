import { NextResponse } from "next/server";

export async function GET(request) {
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(`${origin}/`);

  response.cookies.set("gamersonline_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
