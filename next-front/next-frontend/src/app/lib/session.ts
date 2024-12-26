'use server'
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string) {
  console.log("Creating session for user:", userId);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  console.log("Session will expire at:", expiresAt);

  const session = await encrypt({ userId, expiresAt });
  console.log("Session token generated:", session);

  const cookie = await cookies();

  // Explicitly set the session cookie with corrected 'sameSite' value
  cookie.set("session", session, {
    httpOnly: true, // Prevent JS access to the cookie
    secure: process.env.NODE_ENV === "production", // Only secure in production
    path: "/", // Make the cookie available across the entire site
    expires: expiresAt, // Set cookie expiration time
    sameSite: "strict", // Corrected to lowercase "strict"
  });


  console.log("Session cookie set.");
}

export async function deleteSession() {
  console.log("Deleting session cookie...");
  (await cookies()).delete("session");
  console.log("Session cookie deleted.");
}

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  console.log("Encrypting session payload:", payload);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
  console.log("Encrypted session token:", token);
  return token;
}

export async function decrypt(session: string | undefined = "") {
  console.log("Decrypting session...");

  if (!session || !session.includes(".")) {
    console.log("Invalid session token format. Token is missing or malformed.");
    return null;  // Return early if session is invalid
  }

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    console.log("Session successfully decrypted:", payload);
    return payload;
  } catch (error) {
    console.log("Failed to verify session:", error);
  }
}