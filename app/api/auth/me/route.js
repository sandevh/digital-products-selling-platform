import { verifyToken } from "@/lib/VerifyToken";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    return NextResponse.json({
      id: payload.id,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}