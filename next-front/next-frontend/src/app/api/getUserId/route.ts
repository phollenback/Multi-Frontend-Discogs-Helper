import { NextResponse } from "next/server";
import { decrypt } from "../../lib/session"; // Assuming your decrypt function is in this file
import { cookies } from "next/headers"; // To access cookies

export async function GET() {
  const cookie = (await cookies()).get("session")?.value; // Extract the session cookie
  const session = await decrypt(cookie); // Decrypt the session token
  
  if (!session || !session.userId) {
    // Handle the case where the session is invalid or expired
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }

  // If the session is valid, return the userId
  return NextResponse.json({ userId: session.userId });
}