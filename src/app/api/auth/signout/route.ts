import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear auth token cookie
  response.cookies.delete("auth-token");

  return response;
}

