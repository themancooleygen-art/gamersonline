import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(process.env.NEXTAUTH_URL);
  response.cookies.set("gamersonline_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
