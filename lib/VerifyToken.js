import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyToken(token) {
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
