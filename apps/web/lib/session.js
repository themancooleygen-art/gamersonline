import jwt from "jsonwebtoken";

const SESSION_SECRET = process.env.NEXTAUTH_SECRET;

export function createSessionToken(payload) {
  return jwt.sign(payload, SESSION_SECRET, {
    expiresIn: "7d",
  });
}

export function verifySessionToken(token) {
  return jwt.verify(token, SESSION_SECRET);
}
